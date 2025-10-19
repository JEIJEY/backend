const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const proveedores = [
      { id_proveedor: 1, nombre: "Distribuidora ABC" },
      { id_proveedor: 2, nombre: "Comercializadora Andina" },
      { id_proveedor: 3, nombre: "La Bodega Central" },
    ];
    res.status(200).json(proveedores);
  } catch (error) {
    console.error("❌ Error al obtener proveedores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
