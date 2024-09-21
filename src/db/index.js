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

function createMediaTypesTable(db) {
  return new Promise((resolve, reject) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS media_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    `;
    db.run(sql, (err) => {
      if (err) {
        console.log('Error creating media_types table: ', err.message);
        reject(err);
      } else {
        console.log('media_types created successfully or already exists');
        resolve();
      }
    });
  });
}

function createMediaLibraryTable(db) {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS media_library (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        release_date INTEGER,
        media_type_id INTEGER NOT NULL,
        base_path TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (media_type_id) REFERENCES media_types(id)
  );
`;
    db.run(sql, (err) => {
      if (err) {
        console.log('Error creating media_library table: ', err.message);
        reject(err);
      } else {
        console.log('media_library table created or already exists');
        resolve();
      }
    });
  });
}

function createSeasonsTable(db) {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS seasons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        media_library_id INTEGER NOT NULL,
        season_number INTEGER NOT NULL,
        title TEXT,
        FOREIGN KEY (media_library_id) REFERENCES media_library(id)
  );
`;
    db.run(sql, (err) => {
      if (err) {
        console.log('Error creating seasons table: ', err.message);
        reject(err);
      } else {
        console.log('Seasons table created or already exists');
        resolve();
      }
    });
  });
}

function createEpisodesTable(db) {
  return new Promise((resolve, reject) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS episodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        media_library_id INTEGER NOT NULL,
        season_id INTEGER,
        episode_number INTEGER,
        title TEXT,
        file_path TEXT NOT NULL,
        duration INTEGER,
        FOREIGN KEY (media_library_id) REFERENCES media_library(id),
        FOREIGN KEY (season_id) REFERENCES seasons(id)
  );
    `;
    db.run(sql, (err) => {
      if (err) {
        console.log('Error creating episodes table', err.message);
        reject(err);
      } else {
        console.log('Episodes table successfully created or already exists');
        resolve();
      }
    });
  });
}

function initializeMediaTypes(db) {
  return new Promise((resolve, reject) => {
    const mediaTypes = ['Movie', 'TV Show', 'Anime'];
    const placeholders = mediaTypes.map(() => '(?)').join(',');
    const sql = `INSERT OR IGNORE INTO media_types (name) VALUES ${placeholders}`;

    db.run(sql, (err) => {
      if (err) {
        console.error('Error initializing media types', err.message);
        reject(err);
      } else {
        console.log('Media Types Successfully initialized');
        resolve();
      }
    });
  });
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
      createMediaTypesTable(db), // Create media_types table first
      createMediaLibraryTable(db),
      createUserTable(db), // Ensure user table is created after media_types
      createSeasonsTable(db),
      createEpisodesTable(db),
      initializeMediaTypes(db),
    ]).then(() => db); // Wait for all tables to be created
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    throw err; // Rethrow the error to handle it in your application
  });

// Export dbPromise for use in other modules
export { dbPromise };
export default dbPromise;
