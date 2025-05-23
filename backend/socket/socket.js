const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
//
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://spot-it-jllp.vercel.app/",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

const userSocketMap = {}; //userId: socketId

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };
