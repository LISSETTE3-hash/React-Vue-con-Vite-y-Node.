const express = require("express");
const router = express.Router();

let users = [];
let idCounter = 1;

// Obtener todos los usuarios
router.get("/", (req, res) => {
  res.json(users);
});

// Crear usuario
router.post("/", (req, res) => {
  const user = { id: idCounter++, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

// Actualizar usuario
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { id, ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

// Eliminar usuario
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.status(204).end();
});

module.exports = router;
