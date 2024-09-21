import sqlite3 from 'sqlite3';
import { DB_NAME } from '../constants.js';

const sqlite = sqlite3.verbose();

function createUsersTable(db) {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        refreshToken TEXT
      )
    `;
    db.run(sql, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        reject(err);
      } else {
        console.log('Users table created or already exists');
        resolve();
      }
    });
  });
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database(DB_NAME, async (err) => {
      if (err) {
        console.error('Error connecting to the database:', err.message);
        reject(err);
      } else {
        console.log('Connected to the database');
        try {
          await createUsersTable(db);
          resolve(db);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

export const dbPromise = initializeDatabase();

export default dbPromise;
