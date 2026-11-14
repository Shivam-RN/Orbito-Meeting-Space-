import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { initDB } from "./config/db.js";
import { clerkMiddleware } from '@clerk/express'
import { handleClerkWebhook } from "./controllers/webhookController.js";
import meetingRouter from "./routes/meetingRoutes.js";
import http from 'http'
import { Server } from "socket.io";
import { setupSocketIO } from "./socket.js";

const app = express()
const server = http.createServer(app)

await initDB()

const allowedOrigins = process.env.ORIGINS.split(',');
app.use(cors({origin: allowedOrigins,credentials: true}))

app.use(cookieParser())

app.use("/api/clerk", express.raw({type: "application/json" }), handleClerkWebhook)
app.use(clerkMiddleware())

app.get('/', (req,res) => {
    res.send('Hello from server')
})

app.use("/api/meetings", meetingRouter)

const io = new Server(server, {
    cors: {origin: allowedOrigins, credentials: true}
})

setupSocketIO(io)

app.use((err, _req, res, _next)=>{
    console.error(`[Error] ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
})

server.listen(3000, () => {
    console.log('Server is running on port 3000')
} )  
