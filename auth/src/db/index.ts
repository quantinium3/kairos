import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/auth-schema';

export const db = drizzle(process.env.DATABASE_URL!);
export { schema }
