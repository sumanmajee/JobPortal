import express from "express";
import connectDB from "./db/database.js";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";

dotenv.config({
    path: "./.env"
})

const app = express()

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))


// routes import

import userRouter from "./routes/user.routes.js"

// routes declaration

app.use("/api/v1/user", userRouter)

connectDB()

app.use(errorMiddleware)

export { app }