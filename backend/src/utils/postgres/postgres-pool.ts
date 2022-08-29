import { Pool } from "pg";
import ApiError from "../../types/ApiError";
require("dotenv").config();

/**
 * Postgres pool.
 */
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD?.toString(),
  port: parseInt(process.env.PGPORT!, 10),
});

// The pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
  console.error("❌ [postgres-pool] - Unexpected error on idle client : ", err);
  throw new ApiError(err.message, 500);
});

export default pool;
