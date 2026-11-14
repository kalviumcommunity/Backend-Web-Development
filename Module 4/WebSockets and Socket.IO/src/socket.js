'use strict';

const { Server } = require('socket.io');

function initSocket(httpServer) {
  // TODO 1: create a new Socket.IO server bound to httpServer
  //         (pass { cors: { origin: '*' } } as options)
  const io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log(`[+] connected: ${socket.id}`);

    socket.on('joinRoom', (data) => {
      socket.join(data.room);
    });

    socket.on('leaveRoom', (data) => {
      socket.leave(data.room);
    });

    socket.on('newComment', (data) => {
      io.to(data.room).emit('commentAdded', data);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

module.exports = { initSocket };
