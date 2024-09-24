import express from "express";
import cors from "cors";
import path from 'path';
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ linit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/hls_output", express.static(path.join(process.cwd(), 'hls_output')));

import userRouter from "./routes/user.routes.js";
import databaseRouter from "./routes/refresh.routes.js";
import moviesRouter from "./routes/movie.routes.js"
import watchRouter from "./routes/watch.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/database", databaseRouter)
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/watch", watchRouter)

export { app };
