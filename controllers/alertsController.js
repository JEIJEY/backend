// ======================================================
// 📦 CONTROLADOR DE ALERTAS
// ======================================================

const { obtenerAlertasStockCritico } = require("../services/alertsService");

const listarAlertasDashboard = async (req, res) => {
  try {
    const productos = await obtenerAlertasStockCritico();


    if (!productos || productos.length === 0) {
      return res.status(200).json({
        ok: true,
        data: {
          total: 0,
          productos: [],
          mensaje: "No hay productos con stock crítico",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        total: productos.length,
        productos,
      },
    });
  } catch (error) {
    console.error("❌ Error en listarAlertasDashboard:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener las alertas de stock crítico",
      error: error.message,
    });
  }
};

// ======================================================
// 📤 EXPORTAR CONTROLADOR
// ======================================================
module.exports = { listarAlertasDashboard };
