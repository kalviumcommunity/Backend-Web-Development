
const { Server } = require('socket.io');

function initSocket(httpServer) {
  // Create Socket.IO and attach it to the existing HTTP server.
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // Runs whenever a client connects.
  io.on('connection', (socket) => {
    console.log('[+] connected:', socket.id);

    // Add this client to the requested room.
    socket.on('joinRoom', (data) => {
      socket.join(data.room);
    });

    // Remove this client from the requested room.
    socket.on('leaveRoom', (data) => {
      socket.leave(data.room);
    });

    // Send the comment to everyone in that room,
    // including the client who sent it.
    socket.on('newComment', (data) => {
      io.to(data.room).emit('commentAdded', data);
    });

    // Runs when this client disconnects.
    socket.on('disconnect', (reason) => {
      console.log('[-] disconnected:', socket.id, `(${reason})`);
    });
  });

  // Return the Socket.IO instance.
  return io;
}

module.exports = { initSocket };
