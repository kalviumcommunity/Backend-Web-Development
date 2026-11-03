const { Server } = require("socket.io");

function initSocket(httpServer) {
  // 1. Create a new Server instance with CORS configured
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  // 2. Listen for incoming client connections
  io.on("connection", (socket) => {
    console.log(`[+] connected: ${socket.id}`);

    // 3. Handle 'joinRoom' event
    socket.on("joinRoom", (data) => {
      if (data?.room) {
        socket.join(data.room);
      }
    });

    // 4. Handle 'leaveRoom' event
    socket.on("leaveRoom", (data) => {
      if (data?.room) {
        socket.leave(data.room);
      }
    });

    // 5. Handle 'newComment' event and broadcast to the room
    socket.on("newComment", (data) => {
      if (data?.room) {
        io.to(data.room).emit("commentAdded", data);
      }
    });

    // 6. Handle 'disconnect' event with reason logging
    socket.on("disconnect", (reason) => {
      console.log(`[-] disconnected: ${socket.id} (${reason})`);
    });
  });

  // 7. Return the initialized Server instance
  return io;
}

module.exports = { initSocket };
