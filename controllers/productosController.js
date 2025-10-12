// 📦 Importar el modelo que maneja la lógica con MySQL
const ProductosModel = require("../models/productosModel");

// ============================================================
// 🟢 OBTENER TODOS LOS PRODUCTOS
// GET /api/productos
// ============================================================
const getProductos = async (req, res) => {
  try {
    const productos = await ProductosModel.getAll();
    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

// ============================================================
// 🟢 AGREGAR NUEVO PRODUCTO
// POST /api/productos
// ============================================================
const postProductos = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor,
    } = req.body;

    // Validación básica
    if (!nombre || !precio_unitario || !id_categoria || !id_proveedor) {
      return res.status(400).json({ message: "⚠️ Faltan campos obligatorios" });
    }

    // Llamar al modelo para insertar
    const idInsertado = await ProductosModel.postProducto({
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor,
    });

    res.status(201).json({
      message: "✅ Producto agregado correctamente",
      id_insertado: idInsertado,
    });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    res.status(500).json({ message: "Error al agregar producto", error: error.message });
  }
};

// ============================================================
// 🟡 ACTUALIZAR PRODUCTO
// PUT /api/productos/:id
// ============================================================
const putProductos = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor,
    } = req.body;

    const resultado = await ProductosModel.putProducto(
      id,
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_proveedor
    );

    if (resultado === 0) {
      return res.status(400).json({ message: "❌ No se pudo actualizar el producto" });
    }

    res.status(200).json({ message: "✅ Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

// ============================================================
// 🔴 ELIMINAR PRODUCTO
// DELETE /api/productos/:id
// ============================================================
const deleteProductos = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await ProductosModel.delProducto(id);

    if (!resultado) {
      return res.status(404).json({ message: "❌ Producto no encontrado" });
    }

    res.status(200).json({ message: "✅ Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};

// ============================================================
// 📤 Exportar funciones para usarlas en las rutas
// ============================================================
module.exports = {
  getProductos,
  postProductos,
  putProductos,
  deleteProductos,
};
