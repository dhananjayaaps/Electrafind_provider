const { Server } = require("socket.io");
const { chargingStation, chargingSession } = require('../models'); 

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this to your allowed origins
      methods: ["GET", "POST"],
    },
  });

  const clients = new Map(); // Store Socket.IO clients (user/provider)
  const qrCodeProviderMap = new Map();
  const sessions = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Register user or provider
    socket.on("register", (data) => {
      const { id, role } = data;
      clients.set(id, { socket, role });
      console.log(`${role} registered with ID: ${id}`);
      console.log(clients);
    });

    // Handle QR Code Scan by Client
    socket.on("scan-qr", async ({ qrCode, clientId, clientName }) => {
      console.log(`Client ${clientId} scanned QR code: ${qrCode}`);
    
      try {
        const existingStation = await chargingStation.findOne({ where: { VerificationCode: qrCode } });
    
        if (!existingStation) {
          socket.emit("session-error", { message: "Provider not found for this QR code." });
          return;
        }
    
        const providerId = existingStation.StationID;
        if (!providerId) {
          socket.emit("session-error", { message: "Provider not found for this QR code." });
          return;
        }
    
        const providerClient = clients.get(providerId.toString());
    
        if (providerClient) {
          // Create a new session ID
          const sessionId = `session-${Date.now()}`;
          sessions.set(sessionId, { clientId, providerId, status: "pending" });
    
          // Save the session to the database with status 'pending'
          const newSession = await chargingSession.create({
            Status: "pending",
            userId: clientId,
            providerID: providerId,
          });

          console.log("New session created:", newSession);
    
          // Send session request to provider
          providerClient.socket.emit("session-request", { sessionId, clientId, clientName, sessionNumber: newSession.SessionID });
          console.log(`Session request sent to provider ${providerId}`);
    
          // Notify the client that the request is being processed
          socket.emit("session-pending", { sessionId, message: "Your session request is being processed." });
        } else {
          socket.emit("session-error", { message: "Provider is not available." });
        }
      } catch (error) {
        console.error("Error processing QR code scan:", error);
        socket.emit("session-error", { message: "An error occurred while processing your request." });
      }
    });
    
    // Handle session acceptance by provider
    socket.on("accept-session", async ({ sessionId, accept, sessionNumber }) => {
        try {
        // Find the session from the database
        const session = await chargingSession.findOne({ where: { SessionID: sessionNumber } });
    
        if (!session) {
            socket.emit("session-error", { message: "Session not found." });
            return;
        }
    
        if (accept) {
            session.status = "New"; // Update session status to 'New'
    
            // Update the session status in the database
            await chargingSession.update(
            { Status: "New" }, // Update the status to 'New'
            { where: { SessionID: sessionNumber } }
            );
    
            // Find the relevant client and provider from the clients map
            const clientSocket = [...clients.values()].find(
            (client) => client.role === "user" && client.socket.id === session.clientId
            );
            const providerSocket = [...clients.values()].find(
            (client) => client.role === "provider" && client.socket.id === session.providerId
            );
    
            // Notify the client and provider about the session start
            if (clientSocket) {
            clientSocket.socket.emit("session-start", { sessionId, message: "Your charging session has started." });
            }
            if (providerSocket) {
            providerSocket.socket.emit("session-start", { sessionId, message: "Charging session has started." });
            }
    
            console.log("Session status updated to 'New' and session started:", session);
        } else {
            // Decline the session and delete it from the sessions map
            const deletedSession = chargingSession.destroy({ where: { SessionID: sessionNumber } });
            socket.emit("session-error", { message: "Session request declined." });
        }
        } catch (error) {
        console.error("Error handling session acceptance:", error);
        socket.emit("session-error", { message: "An error occurred while processing your request." });
        }
    });
  

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      [...clients.entries()].forEach(([key, client]) => {
        if (client.socket === socket) {
          clients.delete(key);
        }
      });
    });
  });

  console.log("Socket.IO server initialized.");
}

module.exports = initWebSocket;
