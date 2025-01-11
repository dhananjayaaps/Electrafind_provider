const cors = require('cors');
const express = require('express');
const app = express();
const routes = require('../routes/index'); // Import the routes index file
const initWebSocket = require('./socket'); // Import the WebSocket logic

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

// Base API route
app.use('/api', routes);

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('Electric Vehicle Charging System API is running!');
});

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 0;

const appStart = () => {
  console.log("Starting the app...");
  try {
    const server = app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`);
    });

    // Initialize WebSocket server with Express server instance
    initWebSocket(server);

  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

// Start the app
appStart();
