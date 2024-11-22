import { generateHLSSegment } from "../transcoder/main.transcoder.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs"
import path from "path"

const createHLSSegment = async (userId = '1', mediaPath, timestamp) => {
  const hlsSegmentOutputDir = path.join(process.cwd(), `hls_segment/${userId}`);

  if (!fs.existsSync(hlsSegmentOutputDir)) {
    fs.mkdirSync(hlsSegmentOutputDir, { recursive: true });
  }

  const m3u8OutputDir = path.join(hlsSegmentOutputDir, 'index.m3u8');
  await generateHLSSegment(mediaPath, m3u8OutputDir, timestamp);

  fs.watch(hlsSegmentOutputDir, async (eventType, fileName) => {
    if (eventType === 'rename' && fileName.startsWith('segment_' && fileName.endsWith('.ts'))) {
      const segmentPath = path.join(hlsSegmentOutputDir, fileName);
      try {
        const segmentData = fs.readFileSync(segmentPath);
        await axios.post(`${apiEndpoint}/${movieId}`, segmentData, {
          headers: {
            'Content-type': 'video/MP2T',
          }
        });
      } catch (err) {
        console.error(`Error sending segment: ${err.message}`);
      }
    }

  })

  return 'http://localhost:6969/hls/index.m3u8';
}

export const startMediaEncoding = asyncHandler(async (req, res, next) => {
  try {
    const mediaPath = req.query.path;
    const timeStamp = req.query.t || 0;
    const userId = req.query.userId;

    if (!userId) {
      throw new apiError(400, "userId is required");
    }

    if (!mediaPath) {
      throw new apiError(400, "mediaPath is required");
    }

    const streamingUrl = await createHLSSegment(userId, mediaPath, timeStamp);

    res.status(200).json(
      new apiResponse(200, {
        playlistUrl: streamingUrl,
      }, "Movie data fetched successfully")
    );
  } catch (err) {
    next(err);
  }
})
