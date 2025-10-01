const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Simulación de base de datos en memoria
let users = [];
let idCounter = 1;

// 📌 Validación de datos
function validateUser(user) {
  const errors = {};
  if (!user.dni || user.dni.length < 7) errors.dni = 'DNI inválido';
  if (!user.nombres || user.nombres.trim() === '') errors.nombres = 'Nombres requeridos';
  if (!user.apellidos || user.apellidos.trim() === '') errors.apellidos = 'Apellidos requeridos';
  if (!user.fecha_nacimiento) errors.fecha_nacimiento = 'Fecha de nacimiento requerida';
  if (!user.genero) errors.genero = 'Género requerido';
  if (!user.ciudad) errors.ciudad = 'Ciudad requerida';
  return errors;
}

// 📌 Endpoint de salud
app.get('/', (req, res) => {
  res.send('🚀 API funcionando en /api/users');
});

// 📌 Obtener todos los usuarios
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 📌 Registrar usuario
app.post('/api/users', (req, res) => {
  const errors = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const newUser = { id: idCounter++, ...req.body };
  users.push(newUser);

  res.status(201).json({
    message: '✅ Usuario registrado correctamente',
    user: newUser
  });
});

// 📌 Actualizar usuario
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });

  const errors = validateUser(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  users[index] = { id, ...req.body };
  res.json({
    message: '✏️ Usuario actualizado correctamente',
    user: users[index]
  });
});

// 📌 Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const exists = users.some(u => u.id === id);
  if (!exists) return res.status(404).json({ error: 'Usuario no encontrado' });

  users = users.filter(u => u.id !== id);
  res.json({ message: '🗑️ Usuario eliminado correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});