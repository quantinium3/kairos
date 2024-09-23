import sqlite3 from 'sqlite3';
import { DB_NAME } from '../constants.js';

const sqlite = sqlite3.verbose();

function createUserTable(db) {
  return new Promise((resolve, reject) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      refreshToken TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `;
    db.run(sql, (err) => {
      if (err) {
        console.log('Error creating user table', err.message);
        reject(err);
      } else {
        console.log('Created the user table successfully');
        resolve();
      }
    });
  });
}

function createMoviesTable(db) {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      directoryPath TEXT NOT NULL,
      filePath TEXT_NOT NULL,
      year TEXT,
      releaseDate TEXT,
      runtime TEXT,
      genre TEXT,
      director TEXT,
      writer TEXT,
      actor TEXT,
      description TEXT,
      language TEXT,
      country TEXT,
      posterUrl TEXT,
      imdbRating TEXT
    );
      `;
    db.run(sql, (err) => {
      if (err) {
        console.log("Error creating the movies table", err.message);
        reject(err);
      } else {
        console.log("Created the movies table successfully");
        resolve();
      }
    })
  })
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_NAME, (err) => {
      if (err) {
        console.error('Error connecting to database: ', err.message);
        reject(err);
      } else {
        console.log('Connected to sqlite database');
        resolve(db);
      }
    });
  });
}

let dbPromise;
dbPromise = initializeDatabase()
  .then((db) => {
    console.log('Creating tables...');
    return Promise.all([
      createUserTable(db),
      createMoviesTable(db),
    ]).then(() => db);
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    throw err;
  });

export { dbPromise };
export default dbPromise;
