import express from "express";
import { getMovie } from "../controllers/watch.controller.js"

const router = express.Router();

router.route('/:id').get(getMovie)

export default router;


