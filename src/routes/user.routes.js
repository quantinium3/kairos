import express from 'express';
import {
    changePassword,
  deleteUser,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/user.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/profile').get(verifyJWT, getUserProfile);
router.route('/profile').delete(verifyJWT, deleteUser);
router.route('/change-password').post(verifyJWT, changePassword)

export default router;