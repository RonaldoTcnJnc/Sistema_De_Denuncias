import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('--- DB CONFIG ---');
// Configuración flexible: usa DATABASE_URL (Render/Railway/Heroku) o variables individuales
const databaseUrl = process.env.DATABASE_URL;

console.log('DATABASE_URL exists:', !!databaseUrl);

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = databaseUrl
  ? {
    connectionString: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  }
  : {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: false
  };

const pool = new Pool(connectionConfig);

export default pool;
