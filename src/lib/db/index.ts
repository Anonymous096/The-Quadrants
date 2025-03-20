import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db: NeonHttpDatabase<typeof schema> = drizzle(sql, { schema });