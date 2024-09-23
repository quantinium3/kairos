import { ACCESS_TOKEN_SECRET, MOVIES_DIR, VIDEO_EXT } from '../../constants.js';
import dbPromise from '../index.js';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

async function fetchMovieInfo(movieName) {
  try {
    const res = await axios.get(
      `${process.env.OMDB_URI}/?t=${encodeURIComponent(movieName)}&apiK=${process.env.OMDB_API_KEY}`
    );
    console.log(res)
    return res.data.Response === 'True' ? res.data : null;
  } catch (err) {
    console.error('Error fetching movie info:', err.message);
    return null;
  }
}

async function addMovieToDatabase(db, movieData, moviePath, fileName) {
  const sql = `
    INSERT OR REPLACE INTO movies (
      title, directoryPath, filePath, year, releaseDate, runtime, 
      genre, director, writer, actor, description, language, 
      country, posterUrl, imdbRating
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    movieData.Title,
    moviePath,
    path.join(moviePath, fileName),
    movieData.Year,
    movieData.Released,
    movieData.Runtime,
    movieData.Genre,
    movieData.Director,
    movieData.Writer,
    movieData.Actors,
    movieData.Plot,
    movieData.Language,
    movieData.Country,
    movieData.Poster,
    movieData.imdbRating,
  ];

  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

async function refreshMovieDatabase() {
  try {
    const db = await dbPromise;
    const directories = await fs.readdir(MOVIES_DIR);

    for (const dir of directories) {
      const moviePath = path.join(MOVIES_DIR, dir);
      const stats = await fs.stat(moviePath);

      if (stats.isDirectory()) {
        const files = await fs.readdir(moviePath);
        const videoFiles = files.filter((file) =>
          VIDEO_EXT.includes(path.extname(file).toLowerCase())
        );

        if (videoFiles.length > 0) {
          const movieName = dir;
          const fileName = videoFiles[0]; // Assuming one video file per directory
          const movieData = await fetchMovieInfo(movieName);

          if (movieData) {
            await addMovieToDatabase(db, movieData, moviePath, fileName);
            console.log(`Added/Updated: ${movieName}`);
          } else {
            console.log(`Skipped: ${movieName} (No data found)`);
          }
        }
      }
    }

    console.log('Movie database refresh completed.');
  } catch (err) {
    console.error('Error refreshing movie database:', err);
  }
}

export { refreshMovieDatabase };
