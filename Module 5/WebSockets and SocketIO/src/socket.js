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

    const broadcastRoomUpdate = (room, payload) => {
      if (!room) return;
      io.to(room).emit('commentAdded', payload);
      io.to(room).emit('postCreated', payload);
    };

    socket.on('newComment', (data) => {
      broadcastRoomUpdate(data && data.room, data);
    });

    socket.on('newPost', (data) => {
      broadcastRoomUpdate(data && data.room, data);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

module.exports = { initSocket };
