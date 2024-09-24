import express from 'express';
import { getAllMovies, getSpecificMovieInfoById, getSpecificMovieInfoByName } from '../controllers/movie.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(getAllMovies);
router.route('/:id').get(getSpecificMovieInfoById)
router.route('/:name').get(getSpecificMovieInfoByName);

export default router;
