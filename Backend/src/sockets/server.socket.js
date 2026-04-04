import {Server} from 'socket.io'

let io;
export function initSocket(httpServer){
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST']
        },
        transports: ['websocket', 'polling']
    })

    console.log('✅ Socket.io server initialized')

    io.on('connection', (socket) => {
        console.log('👤 User connected:', socket.id)

        socket.on('disconnect', (reason) => {
            console.log('👤 User disconnected:', socket.id, '- Reason:', reason)
        })

        socket.on('error', (error) => {
            console.error('❌ Socket error:', error)
        })
    })

    io.on('error', (error) => {
        console.error('❌ Socket.io server error:', error)
    })
}

export function getIO(){
    if(!io){
        throw new Error('Socket.io not initialized')
    }
    return io
}