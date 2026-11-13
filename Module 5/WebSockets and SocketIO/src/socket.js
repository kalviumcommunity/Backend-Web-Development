const { Server } = require('socket.io');

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket) => {
        console.log('[+] connected:', socket.id);

        // Join a room
        socket.on('joinRoom', (data) => {
            socket.join(data.room);
        });

        // Leave a room
        socket.on('leaveRoom', (data) => {
            socket.leave(data.room);
        });

        // Broadcast comment to everyone in the room
        socket.on('newComment', (data) => {
            io.to(data.room).emit('commentAdded', data);
        });

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            console.log(
                `[-] disconnected: ${socket.id} (${reason})`
            );
        });
    });

    return io;
}

module.exports = { initSocket };