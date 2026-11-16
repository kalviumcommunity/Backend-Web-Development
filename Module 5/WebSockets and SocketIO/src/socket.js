'use strict';

const { Server } = require('socket.io');

function initSocket(httpServer) {

  // TODO 1: Create Socket.IO server
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {

    // TODO 2: Connection message
    console.log(`[+] connected: ${socket.id}`);

    // TODO 3: Join room
    socket.on('joinRoom', (data) => {
      socket.join(data.room);
    });

    // TODO 4: Leave room
    socket.on('leaveRoom', (data) => {
      socket.leave(data.room);
    });

    // TODO 5: Broadcast new comment
    socket.on('newComment', (data) => {
      io.to(data.room).emit('commentAdded', data);
    });

    // Disconnect message
    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });

  });

  return io;
}

module.exports = { initSocket };