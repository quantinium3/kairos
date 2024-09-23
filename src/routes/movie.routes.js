import express from 'express';
import { getAllMovies } from '../controllers/movie.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(getAllMovies);

export default router;
