const express = require("express");
const { app, server } = require("./socket/socket.js");
const authRouter = require("./routers/authRouter.js");
const userRouter = require("./routers/userRouter.js");
const chatRouter = require("./routers/chatRouter.js");
const messageRouter = require("./routers/messageRouter.js");
const connectDB = require("./db/connect.js");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));

//Routers
app.use("/Spot-It/v1", authRouter);
app.use("/Spot-It/v1/userin", userRouter);
app.use("/Spot-It/v1/userin/chat", chatRouter);
app.use("/Spot-It/v1/userin/chat/message", messageRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("db connected");
    server.listen(port, console.log(`server is listening at port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
