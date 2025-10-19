// ======================================================
// 🚏 RUTAS DE MARCAS
// ======================================================

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const marcas = [
      { id_marca: 1, nombre: "Coca-Cola", estado: 1 },
      { id_marca: 2, nombre: "Nestlé", estado: 1 },
      { id_marca: 3, nombre: "La Muñeca", estado: 1 },
    ];
    res.status(200).json(marcas);
  } catch (error) {
    console.error("❌ Error al obtener marcas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 👇 ESTA LÍNEA ES OBLIGATORIA
module.exports = router;
