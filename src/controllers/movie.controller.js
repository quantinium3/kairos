import { getAllMoviesInfo, getMovieInfo, getMovieInfoAboutSpecificMovie } from '../db/crudOperation/movie.crud.js';
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

export const getSpecificMovieInfoById = asyncHandler(async (req, res) => {
  const movieId = req.params.id;
  const movie = await getMovieInfo(movieId);
  res.status(200).json(new apiResponse(200, movie, "Movie data fetched successfully"))
})

export const getSpecificMovieInfoByName = asyncHandler(async (req, res) => {
  const { movieName } = req.params.name;
  const movie = await getMovieInfoAboutSpecificMovie(movieName);
  res.status(200).json(new apiResponse(200, movie, "Movie data fetched successfully"))
})

