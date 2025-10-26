const alertsModel = require("../models/alertsModel");

const obtenerAlertasStockCritico = async () => {
  try {
    const resultado = await alertsModel.obtenerAlertasStockCritico();
    return resultado;
  } catch (error) {
    console.error("❌ Error en alertsService:", error);
    throw error;
  }
};

module.exports = { obtenerAlertasStockCritico };
