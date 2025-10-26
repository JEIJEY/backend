// ======================================================
// 📦 MODELO DE ALERTAS (stock crítico)
// ======================================================

const getConexion = require("../config/mysql");

const alertsModel = {
  // ======================================================
  // 🔹 Obtener productos con stock crítico según stock_minimo
  // ======================================================
  async obtenerAlertasStockCritico() {
    const conexion = await getConexion();

    // 💡 Detecta productos cuyo stock actual está por debajo del stock mínimo
    const [rows] = await conexion.query(`
      SELECT 
        id_producto,
        nombre,
        descripcion,
        stock,
        stock_minimo,
        unidad_medida,
        precio_unitario
      FROM productos
      WHERE stock <= stock_minimo
        AND estado = 1
      ORDER BY stock ASC;
    `);

    await conexion.end();
    return rows;
  },
};

// ======================================================
// 📤 EXPORTAR MODELO
// ======================================================
module.exports = alertsModel;
