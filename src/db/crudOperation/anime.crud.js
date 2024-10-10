import dbPromise from "../index.js";
import { apiError } from "../../utils/apiError.js";

async function getAllAnime() {
  const db = await dbPromise;
  const animes = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM anime`;
    db.all(sql, [], (err, row) => {
      if (err) {
        return reject( new apiError(500, "Error fetching the anime database"))
      }
      if (!row) {
        return reject(new apiError(404, "Couldnt find the anime in database"));
      }
      resolve(row);
    })
  })
  return animes;
}

async function getAnimeByMalId(malId) {
  const db = await dbPromise;
  const anime = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM anime WHERE animeId = ?`;
    db.get(sql, [malId], (err, row) => {
      if (err) {
        return reject(new apiError(500, "Error fetching the anime database"));
      }
      if (!row) {
        return reject(new apiError(404, "Couldnt find the anime in the database"));
      }
      resolve(row);
    })
  })
  return anime;
}

async function getAnimeEpisodes(malId) {
  const db = await dbPromise;
  const episodes = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM animeEpisodes WHERE animeId = ?`
    db.all(sql, [malId], (err, row) => {
      if (err) {
        return reject(new apiError(500, "Error fetching the anime database"));
      }
      if (!row) {
        return reject(new apiError(404, "Couldn't find the episodes of the anime"));
      }
      resolve(row);
    })
  })
  return episodes;
}

export { getAllAnime, getAnimeByMalId, getAnimeEpisodes };
