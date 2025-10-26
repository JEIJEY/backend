const express = require("express");
const { listarAlertasDashboard } = require("../controllers/alertsController");
const router = express.Router();

// ✅ Prueba de vida (puedes dejarla o quitarla luego)
router.get("/", (req, res) => {
  res.send("✅ ALERTS ROUTE FUNCIONA (con controlador)");
});

// 📊 Ruta real del dashboard
router.get("/dashboard", listarAlertasDashboard);

module.exports = router;
