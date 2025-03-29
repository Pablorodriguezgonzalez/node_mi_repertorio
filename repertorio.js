const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

// Servir archivos estáticos desde la carpeta donde está index.html
app.use(express.static(path.join(__dirname, "public")));

const filePath = path.join(__dirname, "repertorio.json");

// Función para leer el archivo JSON
const readRepertorio = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Función para escribir en el archivo JSON
const writeRepertorio = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// GET /canciones - Obtener todas las canciones
app.get("/canciones", (req, res) => {
  const repertorio = readRepertorio();
  res.json(repertorio);
});

// POST /canciones - Agregar una nueva canción
app.post("/canciones", (req, res) => {
  const repertorio = readRepertorio();
  const nuevaCancion = req.body;
  repertorio.push(nuevaCancion);
  writeRepertorio(repertorio);
  res.status(201).json({ message: "Canción agregada" });
});

// PUT /canciones/:id - Editar una canción
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const repertorio = readRepertorio();
  const index = repertorio.findIndex((c) => c.id == id);
  if (index !== -1) {
    repertorio[index] = { ...repertorio[index], ...req.body };
    writeRepertorio(repertorio);
    res.json({ message: "Canción actualizada" });
  } else {
    res.status(404).json({ message: "Canción no encontrada" });
  }
});

// DELETE /canciones/:id - Eliminar una canción
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  let repertorio = readRepertorio();
  const nuevoRepertorio = repertorio.filter((c) => c.id != id);
  if (nuevoRepertorio.length !== repertorio.length) {
    writeRepertorio(nuevoRepertorio);
    res.json({ message: "Canción eliminada" });
  } else {
    res.status(404).json({ message: "Canción no encontrada" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
