import express from 'express';
import { registerUser } from '../controllers/user.controllers.js';

const router = express.Router();

router.route('/register').post(register);

export default router;
