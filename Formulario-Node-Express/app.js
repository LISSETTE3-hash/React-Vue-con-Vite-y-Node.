const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

const usersRoutes = require("./routes/users");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta API
app.use("/api/users", usersRoutes);

// 👉 ESTA ES LA PARTE IMPORTANTE:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
