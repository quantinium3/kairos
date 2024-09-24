import { apiError } from '../../utils/apiError.js';
import dbPromise from '../index.js';

async function getAllMoviesInfo() {
  const db = await dbPromise;
  const movies = await new Promise((resolve, reject) => {
    const sql = `
    SELECT * FROM movies
    `;
    db.all(sql, [], (err, row) => {
      if (err) {
        return reject(new apiError(500, 'Error fetching the movie database'));
      }
      if (!row) {
        return reject(new apiError(404, 'Movies not found in database'));
      }
      resolve(row);
    });
  });
  return movies;
}

async function getMovieInfoAboutSpecificMovie(movieName) {
  const db = dbPromise;

  const movie = await new Promise((resolve, reject) => {
    const sql = `
        SELECT * FROM movies WHERE title = ?
        `;
    db.get(sql, [movieName], (err, row) => {
      if (err) {
        return reject(
          new apiError(500, 'Error fetching the movie from the database')
        );
      }
      if (!row) {
        return reject(new apiError(404, 'Movie was not found'));
      }
      resolve(row);
    });
  });
  return movie;
}

async function getMovieInfo(movieId) {
  const db = await dbPromise;
  const movie = await new Promise((resolve, reject) => {
    const sql = `
    SELECT * FROM movies WHERE id = ?
`;
    db.get(sql, [movieId], (err, row) => {
      if (err) {
        return reject(new apiError(500, "Error fetching the movie from the database"));
      }
      if (!row) {
        return reject(new apiError(404, "Movie was not found"));
      }
      resolve(row);
    })
  })
  return movie;
}

export { getAllMoviesInfo, getMovieInfoAboutSpecificMovie, getMovieInfo };
