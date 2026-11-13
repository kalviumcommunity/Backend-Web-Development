'use strict';

const { Server } = require('socket.io');

function initSocket(httpServer) {
  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  });

  // Handle client connections
  io.on('connection', (socket) => {
    console.log(`[+] connected: ${socket.id}`);

    // Join room
    socket.on('joinRoom', (data) => {
      socket.join(data.room);
    });

    // Leave room
    socket.on('leaveRoom', (data) => {
      socket.leave(data.room);
    });

    // Broadcast new comment to everyone in the room
    socket.on('newComment', (data) => {
      io.to(data.room).emit('commentAdded', data);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

module.exports = { initSocket };