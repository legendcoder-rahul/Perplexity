import {io } from 'socket.io-client'

let socketInstance = null;

export const initializeSocketConnection = () => {
    // Return existing socket if already connected
    if (socketInstance && socketInstance.connected) {
        console.log('Socket already connected, reusing connection');
        return socketInstance;
    }

    // If socket exists but disconnected, reconnect
    if (socketInstance) {
        console.log('Reconnecting to socket server...');
        socketInstance.connect();
        return socketInstance;
    }

    // Create new socket connection
    console.log('Creating new socket connection...');
    socketInstance = io('http://localhost:3000', {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
    });

    socketInstance.on('connect', () => {
        console.log('✅ Connected to chat server with socket ID:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
        console.log('❌ Disconnected from chat server:', reason);
    });

    socketInstance.on('error', (error) => {
        console.error('Socket error:', error);
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    return socketInstance;
}

export const getSocket = () => {
    return socketInstance;
}

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        console.log('Socket disconnected and cleaned up');
    }
}