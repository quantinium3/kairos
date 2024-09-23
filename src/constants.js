import os from "os";

export const DB_NAME = "lomes.db"

export const ACCESS_TOKEN_SECRET = "1234567890qwertyuiopasdfghjklzxcvbnmi";
export const REFRESH_TOKEN_SECRET = "zxcvbnmasdfghjklqwertyuiop1234567890"
export const ACCESS_TOKEN_EXPIRY = '15m'
export const REFRESH_TOKEN_EXPIRY = '30d';

const userInfo = os.userInfo();
const uid = userInfo.uid;
export const MOVIES_DIR = `/home/quantinium/Movies`

export const VIDEO_EXT = ['.mkv', '.mp4', '.avi', '.mov', '.flv', '.wmv', 'm4v']
