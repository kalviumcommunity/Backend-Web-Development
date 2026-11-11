const { Server } = require('socket.io');

function initSocket(httpServer) {

    // Create Socket.IO server
    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    // Handle new connections
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

        // Handle new comments
        socket.on('newComment', (data) => {

            // Broadcast comment to everyone in that room
            io.to(data.room).emit('commentAdded', data);

        });

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            console.log(
                `[-] disconnected: ${socket.id} (${reason})`
            );
        });

    });

    // Return Socket.IO instance
    return io;
}

module.exports = { initSocket };
