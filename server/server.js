import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { initDB } from "./config/db.js";

const app = express()

initDB()

const allowedOrigins = process.env.ORIGINS.split(',');
app.use(cors({origin: allowedOrigins,credentials: true}))

app.use(cookieParser())
app.use(express.json())

app.get('/', (req,res) => {
    res.send('Hello from server')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
} )  
