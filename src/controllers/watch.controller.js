import Ffmpeg from "fluent-ffmpeg";
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { apiError } from "../utils/apiError.js";

export const getSpecificMediaSegments = (moviePath, segmentDuration, apiEndpoint, movieId) => {
  if (!movieId && !moviePath) {
    throw new apiError(401, "Either one of the movie id or moviePath is needed");
  }
  const outputDir = path.join(process.cwd(), 'hls_output');
  console.log(outputDir)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const playlistPath = path.join(outputDir, 'playlist.m3u8');
  const segmentPattern = path.join(outputDir, 'segment_%d.ts');

  Ffmpeg(moviePath)
    .outputOptions([
      '-c:v libx264',
      '-c:a aac',
      '-f hls',
      `-hls_time ${segmentDuration}`,
      '-hls_list_size 0',
      '-hls_segment_filename', segmentPattern
    ])
    .output(playlistPath)
    .on('start', () => {
      console.log("Encoding started");
    })
    .on('progress', (progress) => {
      console.log(`Processing: ${progress.percent}% done`)
    })
    .on('end', () => {
      console.log('Encoding finished');
    })
    .run();

  fs.watch(outputDir, async (eventType, fileName) => {
    if (eventType === 'rename' && fileName.startsWith('segment_') && fileName.endsWith('.ts')) {
      const segmentPath = path.join(outputDir, fileName);
      try {
        const segmentData = fs.readFileSync(segmentPath);
        await axios.post(`${apiEndpoint}/${movieId}`, segmentData, {
          headers: {
            'Content-Type': 'video/MP2T',
          }
        });
        console.log(`Sent segment ${fileName} to API`)
      } catch (err) {
        console.error(`Error sending segment ${fileName}: `, err.message)
      }
    }
  });
}

export const getMovie = (req, res, next) => {
  try {
    const videoId = req.params.id;
    const videoPath = req.query.path; // Changed from req.params.path to req.query.path
    const segmentDuration = 10;
    const apiEndpoint = '/api/v1/watch';
    console.log(`videoId: ${videoId}, videoPath: ${videoPath}`)

    getSpecificMediaSegments(videoPath, segmentDuration, apiEndpoint, videoId);
    res.send('Encoding started');
  } catch (error) {
    next(error);
  }
}
