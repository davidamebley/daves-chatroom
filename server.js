const express = require('express');
const path = require('path');
const http = require('http');
const dotenv = require('dotenv').config();
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const appBot = 'chatbot';

//Set up our Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Execute whenever Client connects
io.on('connection', (socket) => {
    // Listen to Join room even from client
    socket.on('joinRoom', ({username, room}) =>{
        // Create User
        const user = userJoin(socket.id, username, room);

        // Join user
        socket.join(user.room);

        //Emit welcome message to client
        socket.emit('message', formatMessage(appBot, 'Welcome to Dave\'s Chatroom.'));

        // Broadcast to all other clients in the same room when a user connects
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(appBot, `${user.username} has joined the chatroom`));

        // Broadcast users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    // Listen for chat messages from the client
    socket.on('chatMessage', (msg) =>{
        //Get current user
        const user = getCurrentUser(socket.id);
        //Emit user message to all
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Broadcast to all users when user disconnects/leaves chatroom
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) { //if we got the user that left
            io.to(user.room).emit('message', formatMessage(appBot, `${user.username} has left the chatroom`));

            // Broadcast updated users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});


const PORT = 5000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`Server connected and running on port ${PORT}`);
});