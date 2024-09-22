import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../../constants.js';
import { dbOperation } from '../../utils/dbOperation.js';
import bcrypt from "bcrypt"
import dbPromise from '../index.js';
import jwt from "jsonwebtoken";
import { promisify } from "util"
import { isPasswordValid } from "../../utils/isPasswordValid.js"

const SALT_ROUNDS = 10;

const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify)


/*
 * get the date
 * insert username, email, password and timestamp into the database
 * encrypt the password using bcrypt
 * return the id
 */
export async function register(username, email, password) {
  const date = Date.now();
  const sql = `
    INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)
  `;
  const hash = bcrypt.hashSync(password, SALT_ROUNDS);
  const result = await dbOperation('run', sql, [
    username,
    email,
    hash,
    date,
    date,
  ]);
  return result.lastID;
}

/*
 * we get identifier(username || email) and password
 * get the user data from the db
 * check the password by comparing it to the hash in the db.
 * generate a refresh and access token
 * return the refresh and access token
 */

export async function login(identifier, password) {
  const db = dbPromise;

  const user = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.get(sql, [identifier, identifier], (err, row) => {
      if (err) {
        return reject(err)
      } else {
        resolve(row);
      }
    })
  })

  if (!user || !isPasswordValid(password, user.password)) {
    throw new apiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await createToken(user);
  return { accessToken, refreshToken };
}

/*
 * verify that the refreshToken from the cookies match the original REFRESH_TOKEN_SECRET;
 * if the refreshToken is valid then create a new refresh token
 * update the refresh token in the db and return the access and refresh tokens
 */

export async function refreshToken(oldRefreshToken) {
  try {
    const decoded = jwtVerify(oldRefreshToken, REFRESH_TOKEN_SECRET);

    const db = await new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ? AND refreshToken = ?';
      db.get(sql, [decoded.id, oldRefreshToken], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      })
    })

    if (!user) {
      throw new apiError(401, "RefreshToken is invalid");
    }

    const { accessToken, refreshToken } = await createToken(user);

    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(401, "Invalid or expired refreshToken");
  }
}

/*
 * get the id, username, email from the db
 * create a new refreshToken and accessToken and update it in the db
 * return the tokens
 */

async function createToken(user) {
  const payload = { id: user.id, username: user.username, email: user.email };

  const accessToken = await jwtSign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  })

  const refreshToken = await jwtSign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  })

  const db = await dbPromise;
  await new Promise((resolve, reject) => {
    const sql = 'UPDATE user SET refreshToken = ? WHERE id = ?';

    db.run(sql, [refreshToken, user.id], (err) => {
      if (err) {
        return reject(err);
      } else {
        resolve();
      }
    })
  })

  return { accessToken, refreshToken };
}

/*
 * get the refreshToken
 * update the refresh token in db to NULL
 * if refresh token doesnt match then return error
 * if successsfull return result;
 */
export async function invalidateRefreshToken(refreshToken) {
  const sql = 'UPDATE users SET refreshToken = NULL WHERE refreshToken = ?';
  const result = await dbOperation('run', sql, [refreshToken]);

  if (result.changes === 0) {
    throw new apiError(401, "Invalid Refresh token");
  }

  return result;
}

/*
 * get the (username || email ) and password
 * fetch password from db and compare it to password
 * if valid delete the user.
 */
export async function deleteUser(identifier, password) {
  const db = await dbPromise;

  const user = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.get(sql, [identifier, identifier], (err, row) => {
      if (err) {
        return reject(err)
      } else {
        resolve(row);
      }
    })
  })

  if (!user || !isPasswordValid(password, user.password)) {
    throw new apiError(401, "Invalid Password");
  } else {
    sql = 'DELETE users WHERE username = ? OR email = ?';
    try {
      await dbOperation('run', sql, [identifier, identifier])
      console.log("user Deleted successsfully")
    } catch (err) {
      throw new apiError(500, "User deletion failed");
    }
  }
}

/*
 * get the (username || email) and oldPassword and newPassword
 * fetch the data from the db regarding the user
 * match the oldPassword and the password in the db
 * if the match put the hash of new password in the db
 */
export async function updatePassword(identifier, oldPassword, newPassword) {
  const db = await dbPromise;

  const user = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.get(sql, [identifier, identifier], (err, row) => {
      if (err) {
        return reject(err);
      } else {
        resolve(row);
      }
    });
  });

  if (!user) {
    throw new apiError(404, "No user with the username or email exists");
  }

  if (!isPasswordValid(oldPassword, user.password)) {
    throw new apiError(401, "Invalid password");
  }

  try {
    const sql = 'UPDATE users SET password = ? WHERE username = ? OR email = ?';
    const hash = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    await dbOperation('run', sql, [hash, identifier, identifier]);
    console.log("Password updated successfully");
  } catch (err) {
    throw new apiError(500, "Password wasn't updated");
  }
}

/*
 *
 */

export async function getUserInfo(identifier) {
  const db = await dbPromise;

  const user = await new Promise((resolve, reject) => {
    const sql = 'SELECT id, username, email, createdAt, UpdatedAt FROM users WHERE username = ? OR email = ?';
    db.get(sql, [identifier, identifier], (err, row) => {
      if (err) {
        return reject(new apiError(500, "Error fetching user profile"));
      }
      if(!row) {
        return reject(new apiError(404, "User not found"));
      }
      resolve(row);
    })
  })
  return user;
}
