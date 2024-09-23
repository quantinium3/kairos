import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import dbPromise from '../db/index.js';
import { apiError } from '../utils/apiError.js';
import { ACCESS_TOKEN_SECRET } from '../constants.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new apiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const db = await dbPromise;
    const user = await new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      db.get(sql, [decodedToken.id], (err, row) => {
        if (err) {
          return reject(new apiError(500, 'Database query failed'));
        }
        resolve(row);
      });
    });

    if (!user) {
      throw new apiError(401, 'Invalid Access Token');
    }

    delete user.password;
    delete user.refreshToken;

    req.user = user;

    next();
  } catch (error) {
    throw new apiError(401, error?.message || 'Invalid access token');
  }
});
