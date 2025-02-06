// Import required modules
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = [];

// Define the port
const port = 4000;

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome");
});

const addUser = (userName, roomId) => {
  users.push({
    userName: userName,
    roomId: roomId,
  });
};

const getRoomUsers = (roomId) => {
  return users.filter((user) => user.roomId === roomId);
};

const userLeave = (userName) => {
  users = users.filter((user) => user.userName !== userName);
};

io.on("connection", (socket) => {
  console.log("someone connected");
  socket.on("join-room", ({ roomId, userName }) => {
    console.log("user joined room");
    console.log(roomId);
    console.log(userName);
    socket.join(roomId);
    addUser(userName, roomId);
    socket.to(roomId).emit("user-connected", userName);

    io.to(roomId).emit("all-users", getRoomUsers(roomId));

    socket.on("disconnect", () => {
      console.log("user disconnected");
      socket.leave(roomId);
      userLeave(userName);
      io.to(roomId).emit("all-users", getRoomUsers(roomId));
    });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Zoom clone API on localhost:${port}`);
});
