import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

//Create a new instance of Neon
const sql = neon(process.env.DATABASE_URL!);

//Create a new instance of Drizzle
export const db = drizzle({ client: sql});

