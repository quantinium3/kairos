import express from "express";
import { refreshMovieDatabase } from "../db/crudOperation/refresh.crud.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route('/refresh_database').post(refreshMovieDatabase);

export default router;