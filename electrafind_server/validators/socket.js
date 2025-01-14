const { Server } = require("socket.io");
const { chargingStation, chargingSession } = require('../models'); 

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this to your allowed origins
      methods: ["GET", "POST"],
    },
  });

  const clients = new Map(); // Store Socket.IO clients (client/provider)
  const provider = new Map();
  const qrCodeProviderMap = new Map();
  const sessions = new Map();

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Register client or provider
    socket.on("register", (data) => {
      const { id, role } = data;
      // clients.set(id, { socket, role });
      if (role === "client") {
        clients.set(id, { socket, role });
      }
      if (role === "provider") {
        provider.set(id, { socket, role });
      }
      console.log(`${role} registered with ID: ${id}`);
    });

    // Handle QR Code Scan by Client
    socket.on("scan-qr", async ({ qrCode, clientId, clientName }) => {
      console.log(`Client ${clientId} scanned QR code: ${qrCode} ${clientName}`);
      // console.log('Clientes:', clients);
      // console.log('Provider:', provider);
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

        const providerClient = provider.get(providerId.toString());
    
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

          // console.log("New session created:", newSession);
    
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
        console.log("Session found:", session, "\n\n");
        if (!session) {
            socket.emit("session-error", { message: "Session not found." });
            return;
        }

        const clientSocket = clients.get(session.userId.toString());
    
        if (accept) {
            session.status = "New"; // Update session status to 'New'
    
            // Update the session status in the database
            await chargingSession.update(
            { Status: "New" }, // Update the status to 'New'
            { where: { SessionID: sessionNumber } }
            );

            // Notify the client and provider about the session start
            if (clientSocket) {
            console.log("Client socket found:");
            clientSocket.socket.emit("session-start", { sessionId, message: "Your charging session has started." });
            }
    
            // console.log("Session status updated to 'New' and session started:", session);
        } else {
            // Decline the session and delete it from the sessions map
            const deletedSession = chargingSession.destroy({ where: { SessionID: sessionNumber } });
            socket.emit("session-error", { message: "Session request declined." });
            // console.log("Session User ID:", session.userId, "\n\n");
            console.log("Clients Map:", clients, "\n\n");
            if (clientSocket) {
              clientSocket.socket.emit("session-error", { sessionId, message: "Your charging session has started." });
              // console.log("Send the cancellation", clientSocket.socket);
            }
        }
        } catch (error) {
          
          socket.emit("session-error", { message: "An error occurred while processing your request." });
          if (clientSocket) {
            clientSocket.socket.emit("session-error", { sessionId, message: "Your charging session has Caccelled." });
          }
        }
    });
  

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      
      // Remove the disconnected client from `clients`
      for (const [key, value] of clients.entries()) {
        if (value.socket === socket) {
          clients.delete(key);
          break;
        }
      }
    
      // Remove the disconnected provider from `provider`
      for (const [key, value] of provider.entries()) {
        if (value.socket === socket) {
          provider.delete(key);
          break;
        }
      }
    });
    
  });

  console.log("Socket.IO server initialized.");
}

module.exports = initWebSocket;
