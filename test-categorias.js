const categoriasModel = require("./models/categoriasModel");

(async () => {
  try {
    console.log("🔍 Probando conexión y lectura de categorías...");
    const categorias = await categoriasModel.getAll();
    console.log("✅ Categorías obtenidas:");
    console.table(categorias);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
