import fs from 'fs';
import path from 'path';

const config = JSON.parse(fs.readFileSync(path.resolve('configuration/media.json'), 'utf8'));

export function getFileFromDirectory(directory) {
    const dirPath = config[directory]
    const files = fs.readdirSync(String(dirPath));
    return files.map(file => path.join(dirPath, file));
}
