import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;

// Create a dummy database connection for build time if DATABASE_URL is not available
export const db = DATABASE_URL 
  ? drizzle(DATABASE_URL)
  : drizzle("postgresql://user:password@localhost/dummy");
