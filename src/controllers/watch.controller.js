import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import path from 'path';
import fs from 'fs';
import { generateHLSSegment } from "../transcoder/main.transcoder.js"
import axios from 'axios';

const createHLSSegment = (userId, mediaPath, mediaId, timeStamp) => {
  if (!mediaPath && !mediaId) {
    throw new apiError(400, "At least one of the media id or media path is needed");
  }

  const outputDir = path.join(process.cwd(), `public/hls_segment/${userId}/${mediaId}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const playlistPath = path.join(outputDir, 'index.m3u8');
  const segmentPattern = path.join(outputDir, 'segment_%03d.ts');

  generateHLSSegment(mediaPath, playlistPath, segmentPattern, timeStamp);

  return `/hls_segment/${userId}/${mediaId}/index.m3u8`;
}

export const getMovie = (req, res, next) => {
  try {
    const mediaId = req.params.id;
    const mediaPath = req.query.path;
    const timeStamp = req.query.t || 0;
    const episodeNo = req.query.episode;
    const userId = req.query.userId;

    if (!userId) {
      throw new apiError(400, "userId is required");
    }

    if (!mediaPath) {
      throw new apiError(400, "mediaPath is required");
    }

    const streamingUrl = createHLSSegment(userId, mediaPath, mediaId, timeStamp);

    res.status(200).json(
      new apiResponse(200, {
        playlistUrl: streamingUrl,
      }, "Movie data fetched successfully")
    );
  } catch (err) {
    next(err);
  }
};
