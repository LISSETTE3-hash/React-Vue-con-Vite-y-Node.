const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.resolve(__dirname, "../database.sqlite"), (err) => {
  if (err) console.error("❌ Error al conectar BD:", err.message);
  else console.log("✅ Conectado a SQLite");
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni TEXT NOT NULL,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    fecha_nacimiento TEXT,
    genero TEXT,
    ciudad TEXT
  )
`);

module.exports = db;