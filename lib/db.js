import { Pool } from 'pg';

// Get the connection URL from the environment variable
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString
});

export default pool;
