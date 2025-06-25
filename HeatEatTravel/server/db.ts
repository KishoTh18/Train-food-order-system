import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to add it to your .env?");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dbPromise = (async () => {
  const client = await pool.connect();
  return drizzle(client, { schema });
})();
