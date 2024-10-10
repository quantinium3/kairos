import express from "express";
import { getTvShowById, getAllTVShow, getAllEpisodesOfSeasonById } from "../controllers/tvShow.controller.js";

const router = express.Router();

router.route('/').get(getAllTVShow)
router.route('/:id').get(getTvShowById)
router.route('/:id/episodes/:seasonNo').get(getAllEpisodesOfSeasonById)

export default router;
