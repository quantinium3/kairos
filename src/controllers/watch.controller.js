import { apiError } from "../utils/apiError.js"
import path from 'path';
import fs, { existsSync } from 'fs';
import Ffmpeg from "fluent-ffmpeg";

const createHLSSegment = (mediaPath, mediaId, timeStamp, apiEndpoint) => {
  if (!mediaPath && !mediaId) {
    throw new apiError(400, "At least one of the media id or media path is needed");
  }
  const outputDir = path.join(process.cwd(), 'hls_segment/new');

  if (!existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true }, (err) => {
      if (err) throw err;
    })
  }

  const playlistPath = path.join(outputDir, 'playlist.m3u8')
  const segmentPattern = path.join(outputDir, 'segment_%d.ts');

  const ffmpegCommand = Ffmpeg(mediaPath).outputOptions([
    '-c:v libx264',
    '-c:a aac',
    '-f hls',
    '-hls_time 10',
    '-hls_list_size 0',
    '-hls_segment_filename', segmentPattern
  ]).output(playlistPath).on('start', () => {
    console.log("Encoding started");
  }).on('progress', (progress) => {
    console.log(`Progress: ${progress.percent}%`)
  }).on('end', () => {
    console.log('Encoding ended');
  })

  if (!timeStamp) {
    ffmpegCommand.seekInput(timeStamp);
  }

  ffmpegCommand.run()

  fs.watch(outputDir, async (eventType, fileName) => {
    if (eventType === 'rename' && fileName.startsWith('segment_' && fileName.endsWith('.ts'))) {
      const segmentPath = path.join(outputDir, fileName);
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
}

export const getMovie = ((req, res) => {
  try {
    const videoId = req.params.id;
    const videoPath = req.query.path;
    const timeStamp = req.query.t;
    const apiEndpoint = '/api/v1/watch';

    createHLSSegment(videoPath, videoId, timeStamp, apiEndpoint)
    res.send("Encoding started");
  } catch (err) {
    next(err);
  }

})
