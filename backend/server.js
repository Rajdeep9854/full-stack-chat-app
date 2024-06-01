const express = require('express');
const { chats } = require('./data/data');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const userRoutes = require('../backend/routes/user.router.js')
const chatRoutes = require('./routes/chat.router.js')
const messageRoutes = require('./routes/message.router.js')
const {notFound,errorHandler} = require('../backend/middleware/errorMiddleware.js')

dotenv.config();
connectDB();

const app = express();
app.use(express.json())




app.get("/", (req, res) => {
    res.send("API is running successfully");
})

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message",messageRoutes)







// app.get("/api/chat", (req, res) => {
//     res.send(chats)
// })

// app.get("/api/chat/:id", (req, res) => {
//     //console.log(req.params);
//     const singleChat = chats.find((c) => c._id === req.params.id)
//     res.send(singleChat)
// })

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000


const server = app.listen(PORT, console.log(
    `server stated on port ${PORT}`
))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});