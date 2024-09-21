import connectDB from './index.js';
import { dbOperation } from '../utils/dbOperation.js';

export async function getAllMedia() {
  return dbOperation('all', 'SELECT * FROM media_library');
}

export async function getMediaById() {
  return dbOperation('all', 'SELECT * FROM media_library WHERE id = ?', [id]);
}

export async function addMedia(
  title,
  description,
  releaseDate,
  mediaTypeId,
  basePath
) {
  const now = Date.now();
  const sql = `
    INSERT INTO media_library (title, description, release_date, media_type_id, base_path, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  const result = await dbOperation('run', sql, [
    title,
    description,
    releaseDate,
    mediaTypeId,
    basePath,
    now,
    now,
  ]);
  return result.lastID;
}

export async function deleteMedia(id) {
  const result = await dbOperation(
    'run',
    'DELETE FROM media_library WHERE id = ?',
    [id]
  );
  return result.changes;
}

export async function getEpisodesByMediaId(mediaId) {
  return dbOperation(
    'all',
    'SELECT * FROM episodes WHERE media_library_id = ?',
    [mediaId]
  );
}

export async function getUserData(username) {
  return dbOperation('all', 'SELECT * FROM users WHERE username = ?', [
    username,
  ]);
}

export async function register(username, email, password) {
  const date = Date.now();
  const sql = `
    INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)
  `;
  const result = await dbOperation('run', sql, [
    username,
    email,
    password,
    date,
    date,
  ]);
  return result.lastID;
}
