import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  console.log('Iniciando configuración de base de datos...');
  
  try {
    const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');
    console.log(`Leyendo script SQL desde: ${sqlPath}`);
    
    if (!fs.existsSync(sqlPath)) {
      console.error('Error: No se encuentra el archivo init.sql');
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Ejecutando script SQL en la base de datos...');
    await pool.query(sql);
    
    console.log('¡Éxito! Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error fatal inicializando la base de datos:', error);
  } finally {
    await pool.end();
  }
}

initDB();
