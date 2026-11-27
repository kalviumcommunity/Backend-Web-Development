
'use strict';

const { Server } = require('socket.io');

function initSocket(httpServer) {
  // Create Socket.IO server
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    // Connection log
    console.log(`[+] connected: ${socket.id}`);

    // Join a room
    socket.on('joinRoom', (data) => {
      socket.join(data.room);
    });

    // Leave a room
    socket.on('leaveRoom', (data) => {
      socket.leave(data.room);
    });

    // Broadcast new post to everyone in the room
    socket.on('newPost', (data) => {
      io.to(data.room).emit('postCreated', data);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

module.exports = { initSocket };
