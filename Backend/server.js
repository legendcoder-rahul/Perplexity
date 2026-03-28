import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";


const PORT = process.env.PORT;

const httpServer = http.createServer(app)
connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

initSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});