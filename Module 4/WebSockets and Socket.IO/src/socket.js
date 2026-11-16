'use strict';

const { Server } = require('socket.io');

function initSocket(httpServer) {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log(`[+] connected: ${socket.id}`);

    socket.on('joinRoom', (data) => {
      if (data && data.room) {
        socket.join(data.room);
      }
    });

    socket.on('leaveRoom', (data) => {
      if (data && data.room) {
        socket.leave(data.room);
      }
    });

    socket.on('newComment', (data) => {
      if (!data || !data.room) return;
      io.to(data.room).emit('commentAdded', data);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

module.exports = { initSocket };
