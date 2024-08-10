import express from "express";
import connectDB from "./db/database.js";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";
import { newsLetterCron } from "./automation/newsLetterCron.js";

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
import jobRouter from "./routes/job.routes.js"
import applicationRouter from "./routes/application.routes.js"

// routes declaration

app.use("/api/v1/user", userRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/application", applicationRouter);

newsLetterCron()
connectDB()

app.use(errorMiddleware)

export { app }