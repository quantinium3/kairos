import { getAllAnime, getAnimeByMalId, getAnimeEpisodes } from "../db/crudOperation/anime.crud.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllAnimes = asyncHandler(async (req, res) => {
  try {
    const animes = await getAllAnime();
    res.status(200).json(new apiResponse(200, animes, "Successfully fetched all animes "));
  } catch (err) {
    console.log("couldn't fetch the anime episodes");
    throw new apiError(500, "Couldn't fetch the anime details", err);
  }
})

export const getAnimeById = asyncHandler(async (req, res) => {
  try {
    const malId = req.params.id;
    const anime = await getAnimeByMalId(malId);
    res.status(200).json(new apiResponse(200, anime, "Successfully fetched the anime"));
  } catch (err) {
    console.log("Failed to fetch the anime by Id");
    throw new apiError(500, "Couldnt fetch the anime from the database", err)
  }
})

export const getAllAnimeEpisodes = asyncHandler(async (req, res) => {
  try {
    const malId = req.params.id
    const episodes = await getAnimeEpisodes(malId);
    res.status(200).json(new apiResponse(200, episodes, "Successfully fetched the episodes"));
  } catch (err) {
    console.log("Failed to fetch the anime episodes")
    throw new apiError(500, "Failed to fetch the anime episodes", err);
  }
})
