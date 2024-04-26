const express = require('express');
const { chats } = require('./data/data');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const userRoutes = require('../backend/routes/user.router.js')
const chatRoutes = require('./routes/chat.router.js')
const {notFound,errorHandler} = require('../backend/middleware/errorMiddleware.js')

dotenv.config();
connectDB();

const app = express();
app.use(express.json())




app.get("/", (req, res) => {
    res.send("API is running successfully");
})

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat",chatRoutes)







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
app.listen(PORT, console.log(
    `server stated on port ${PORT}`
))