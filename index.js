// Import required modules
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server
const io = new Server(server);

// Define the port
const port = 4000;

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome");
});

// Start the server
server.listen(port, () => {
  console.log(`Zoom clone API on localhost:${port}`);
});
