import crypto from "crypto"
export const DB_NAME = "lomes.db"

export const ACCESS_TOKEN_SECRET = crypto.getRandomValues(64).toString('hex');
export const REFRESH_TOKEN_SECRET = crypto.getRandomValues(64).toString('hex');
export const ACCESS_TOKEN_EXPIRY = '15m'
export const REFRESH_TOKEN_EXPIRY = '30d';
