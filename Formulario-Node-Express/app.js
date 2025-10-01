const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => {
  res.send("🚀 API funcionando en /api/users");
});

app.use("/api/users", require("./routes/users"));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});