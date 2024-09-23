import { getAllMoviesInfo } from '../db/crudOperation/movie.crud.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
/**
 * GET /api/v1/movies
 * get all the movies
 */

export const getAllMovies = asyncHandler(async (req, res) => {
  const movies = await getAllMoviesInfo();
  res
    .status(200)
    .json(new apiResponse(200, movies, 'Movies Fetched successfully'));
});
