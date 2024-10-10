import express from "express";
import { refreshMovieDatabase } from "../db/crudOperation/refresh.crud.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshAnimeDatabase } from "../db/crudOperation/animeRefresh.crud.js";
import { refreshTvShowDatabase } from "../db/crudOperation/tvShowRefresh.crud.js"

const router = express.Router();

router.route('/refresh/movie').post(refreshMovieDatabase);
router.route('/refresh/tv').post(refreshTvShowDatabase)
router.route('/refresh/anime').post(refreshAnimeDatabase);

export default router;
