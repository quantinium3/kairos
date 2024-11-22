import expresse, { Router } from "express";
import {startMediaEncoding} from "../controllers/encode.controller.js"
const router = Router();

router.route('/:id').get(startMediaEncoding)

export default router;

