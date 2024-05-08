const express = require("express");
const PORT = process.env.PORT || 5000;
const userModel = require("./models/UserModels");
const messageModel = require("./models/MessageModel");
const userRoutes = require("./routes/UserRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const { sendMessage, allMessages, allContacts } = require("./controllers/controllers");

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.send("Chat App with Flutter & Node.js");
});
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    allowOrigin: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io");

  socket.on("setup", (user) => {
    socket.join(user);
    socket.emit("connected");
    socket.emit("contacts",allContacts(user));
    console.log(`${user} setting-Up`);
  });

  socket.on("select user", (selectedUser) => {
    socket.join(selectedUser);
    socket
      .emit("all messages", allMessages(user, selectedUser));
    console.log(`${user} select ${selectedUser} for chat`);

    socket.on("new message", (newMessage) => {
      sendMessage(newMessage);
      socket.in(newMessage.to).emit("message received", newMessage);
      console.log(newMessage);
    });
  });
});
