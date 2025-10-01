const express = require("express");
const router = express.Router();
const db = require("../models/db"); // conexión a SQLite

// 📌 Obtener usuarios
router.get("/", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 📌 Registrar usuario
router.post("/", (req, res) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;
  db.run(
    "INSERT INTO users (dni, nombres, apellidos, fecha_nacimiento, genero, ciudad) VALUES (?,?,?,?,?,?)",
    [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, ...req.body });
    }
  );
});

// 📌 Actualizar usuario
router.put("/:id", (req, res) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;
  const { id } = req.params;
  db.run(
    "UPDATE users SET dni=?, nombres=?, apellidos=?, fecha_nacimiento=?, genero=?, ciudad=? WHERE id=?",
    [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// 📌 Eliminar usuario
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id=?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;