import express from "express";
import cors from "cors";
import path from 'path';
import cookieParser from "cookie-parser";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:4173";

app.use(cors({
    origin: corsOrigin,
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/hls_segment", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', corsOrigin);
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}, express.static(path.join(process.cwd(), 'hls_segment/new')));

import userRouter from "./routes/user.routes.js";
import databaseRouter from "./routes/refresh.routes.js";
import moviesRouter from "./routes/movie.routes.js";
import watchRouter from "./routes/watch.routes.js";
import tvShowRouter from "./routes/tvShow.routes.js";
import animeRouter from "./routes/anime.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/database", databaseRouter);
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/watch", watchRouter);
app.use("/api/v1/tvshow", tvShowRouter);
app.use("/api/v1/anime", animeRouter);

export { app };
