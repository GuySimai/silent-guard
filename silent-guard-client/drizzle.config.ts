import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });



export default defineConfig({
  out: './server/db/migration',
  schema: './server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});