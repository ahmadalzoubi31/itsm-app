import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectString = "postgresql://neondb_owner:npg_GlXwznejE0a4@ep-damp-lab-a8j9axa9-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";

if (!connectString) {
    throw new Error('DATABASE_URL is not defined');
}

export const db = drizzle({ connection: connectString, schema: schema, casing: 'snake_case' });
