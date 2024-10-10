import expresse, { Router } from "express";
import { getAllAnimeEpisodes, getAllAnimes, getAnimeById } from "../controllers/anime.controller.js";

const router = Router();

router.route('/').get(getAllAnimes);
router.route('/:id').get(getAnimeById)
router.route('/:id/episodes').get(getAllAnimeEpisodes)

export default router;
