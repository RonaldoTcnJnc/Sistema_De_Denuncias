import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Asegurar que dotenv busque el .env en la raíz del backend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

console.log('--- DB CONFIG ---');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
const databaseUrl = process.env.DATABASE_URL;

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

console.log('Using DATABASE_URL:', !!databaseUrl);
console.log('Connection config:', { 
    hasConnectionString: !!connectionConfig.connectionString,
    ssl: connectionConfig.ssl 
});

const pool = new Pool(connectionConfig);

export default pool;
