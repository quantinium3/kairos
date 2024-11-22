import { exec, spawn } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

const getNearestKeyframe = (inputKeyframe, keyframe) => {
    if (keyframe.includes(inputKeyframe)) {
        console.log(`Exact match found`);
        return inputKeyframe;
    }

    const nearestKeyframe = keyframe.reduce((prev, curr) =>
        Math.abs(curr - inputKeyframe) < Math.abs(prev - inputKeyframe) ? curr : prev
    );

    return nearestKeyframe;
}

const killFFMPEG = async () => {
    exec('pidof ffmpeg', (err, stdout, stderr) => {
        if (err) {
            console.error("Error: ", err);
            return;
        }
        if (stderr) {
            console.error("std Error: ", stderr);
            return;
        }
        const pid = stdout.trim();
        const pids = pid.split(' ');
        for (const pid of pids) {
            process.kill(pid, 'SIGTERM')
        }
    })
}

const startEncoding = async (keyframe, inputPath, outputPath) => {
    await killFFMPEG();
    ffmpeg()
        .input(inputPath)
        .inputOptions([
            `-ss ${keyframe}`,
        ])
        .outputOptions([
            '-map 0:v:0',
            '-map 0:a:0',
            '-c:v libx264',
            '-preset veryfast',
            '-b:v 2400000',
            '-bufsize 20000000',
            '-maxrate 4000000',
            '-c:a aac',
            '-ac 2',
            '-b:a 182k',
            '-f hls',
            '-hls_time 5',
            '-hls_list_size 0',
            '-start_number 0',
        ])
        .output(outputPath)
        .on('start', () => {
            console.log('started encoding');
        })
        .on('progress', (progress) => {
            console.log(`Progress Percent: ${progress.percent}`);
        })
        .on('end', () => {
            console.log('finished Processing');
        })
        .on('error', (err) => {
            console.error('Error: ', err.message);
        })
        .run();
};

const timeStampToKeyframe = (timestamp) => {
    const [hours, minutes, seconds] = timestamp.split(':').map(parseFloat);
    return ((hours * 3600) + (minutes * 60) + seconds).toFixed(6);
}

const generateHLSSegment = async (inputPath, outputPath, timestamp) => {
    const inputKeyframe = timeStampToKeyframe(timestamp);
    let keyframe = await extractKeyframes(inputPath);
    console.log(`Keyframes: ${keyframe}`);

    const nearestKeyframe = getNearestKeyframe(inputKeyframe, keyframe);
    console.log(`Nearest Keyframe: ${nearestKeyframe}`);

    startEncoding(nearestKeyframe, inputPath, outputPath);
};

const extractKeyframes = (inputPath) => {
    return new Promise((resolve, reject) => {
        const command = `ffprobe -loglevel error -select_streams v:0 \
                          -show_entries packet=pts_time,flags \
                          -of csv=print_section=0 "${inputPath}" \
                          | awk -F',' '/K/ {print $1}'`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running ffprobe', error);
                reject(error);
            }
            if (stderr) {
                console.error('ffprobe error: ', stderr);
                reject(stderr);
            }
            const keyframes = stdout.trim().split('\n');
            console.log('Keyframe timestamps:', keyframes);
            resolve(keyframes);
        });
    });
};

export { generateHLSSegment };
