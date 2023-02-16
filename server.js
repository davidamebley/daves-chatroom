const express = require('express');
const path = require('path');
const http = require('http');
const dotenv = require('dotenv').config();
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set up our Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Execute whenever Client connects
io.on('connection', (socket) => {
    //Emit welcome message to client
    socket.emit('message', 'Welcome to Dave\'s Chatroom.');

    // Broadcast to all other clients of connected new user
    socket.broadcast.emit('message', 'A new user has joined the chatroom');

    // Broadcast to all users when user disconnects/leaves chatroom
    socket.on('disconnect', () => {
        io.emit('message', 'A cherished user has left the chatroom');
    });

    // Listen for chat messages from the client
    socket.on('chatMessage', (msg) =>{
        //Emit this message to all
        io.emit('message', msg);
    });
});


const PORT = 5000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`Server connected and running on port ${PORT}`);
});