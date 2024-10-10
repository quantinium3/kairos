import { getAllTvShow, getTvShowInfoById, getAllAvailableEpisodeById } from "../db/crudOperation/tvShow.crud.js"
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

export const getAllTVShow = asyncHandler(async (req, res) => {
  const tvShows = await getAllTvShow();
  res.status(200).json(new apiResponse(200, tvShows, "Tv shows fetched successfully"));
})

export const getTvShowById = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const tvShow = await getTvShowInfoById(Id);
  res.status(200).json(new apiResponse(200, tvShow, "tv show fetched successfully"))
})

export const getAllEpisodesOfSeasonById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const seasonNo = req.params.seasonNo;
  const episodes = await getAllAvailableEpisodeById(id, seasonNo);
  res.status(200).json(new apiResponse(200, episodes, "Episodes fetched successfully"));
})
