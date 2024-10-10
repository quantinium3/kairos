import { apiError } from "../../utils/apiError.js";
import dbPromise from "../index.js";

async function getAllTvShow() {
  const db = await dbPromise;
  const tvShows = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM tvshows;`
    db.all(sql, [], (err, row) => {
      if (err) {
        return reject(new apiError(500, "Error fetching the tv shows from the database"))
      }
      if (!row) {
        return reject(new apiError(404, "No tv shows were found in the database"))
      }
      resolve(row);
    })
  })
  return tvShows;
}

async function getTvShowInfoById(tvShowId) {
  const db = await dbPromise;
  const tvShow = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM tvshows WHERE tvShowId = ?`
    db.get(sql, [tvShowId], (err, row) => {
      if (err) {
        return reject(new apiError(500, "Error fetching the tv show from the database"))
      }
      if (!row) {
        return reject(new apiError(404, "Couldn't find the request movie"))
      }
      resolve(row);
    })
  })
  return tvShow;
}

async function getAllAvailableEpisodeById(tvShowId, seasonNo) {
  const db = await dbPromise;
  const episodes = await new Promise((resolve, reject) => {
    console.log(`tvShowId: ${tvShowId}, seasonNo: ${seasonNo}`);
    const sql = `SELECT * FROM tvShowsepisodes WHERE tvShowId = ? AND seasonNumber = ?`;
    db.all(sql, [tvShowId, seasonNo], (err, row) => {
      if (err) {
        return reject(new apiError(500, "Error fetching the episodes from the database"))
      }
      if (!row) {
        return reject(new apiError(404, "Couldn't fetcht the requested episodes"));
      }
      resolve(row);
    })
  });
  return episodes;
}

export { getAllTvShow, getTvShowInfoById, getAllAvailableEpisodeById };
