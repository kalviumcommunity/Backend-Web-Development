
'use strict';

const { Server } = require('socket.io');

function initSocket(httpServer) {
  // TODO 1: Create Socket.IO server
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log(`[+] connected: ${socket.id}`);

    // TODO 2: Join room
    socket.on('joinRoom', (data) => {
      socket.join(data.room);
    });

    // TODO 3: Leave room
    socket.on('leaveRoom', (data) => {
      socket.leave(data.room);
    });

    // TODO 4: Broadcast comment
    socket.on('newComment', (data) => {
      io.to(data.room).emit('commentAdded', data);
    });

    // TODO 5: Disconnect
    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

module.exports = { initSocket };
