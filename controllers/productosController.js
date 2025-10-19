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
    res.status(500).json({
      message: "Error al obtener productos",
      error: error.message,
    });
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
      id_marca,
      id_proveedor,
      estado,
    } = req.body;

    // ⚠️ Validación básica
    if (!nombre || !precio_unitario || !id_categoria || !id_marca || !id_proveedor) {
      return res.status(400).json({
        message: "⚠️ Faltan campos obligatorios: nombre, precio_unitario, id_categoria, id_marca, id_proveedor",
      });
    }

    // 🧩 Crear producto
    const idInsertado = await ProductosModel.postProducto({
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_marca,
      id_proveedor,
      estado: estado ?? 1, // si no se envía, queda activo por defecto
    });

    res.status(201).json({
      message: "✅ Producto agregado correctamente",
      id_insertado: idInsertado,
    });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    res.status(500).json({
      message: "Error al agregar producto",
      error: error.message,
    });
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
      id_marca,
      id_proveedor,
      estado,
    } = req.body;

    const resultado = await ProductosModel.putProducto(
      id,
      nombre,
      descripcion,
      stock,
      unidad_medida,
      precio_unitario,
      id_categoria,
      id_marca,
      id_proveedor,
      estado
    );

    if (resultado === 0) {
      return res.status(404).json({
        message: "❌ No se encontró el producto o no se pudo actualizar",
      });
    }

    res.status(200).json({ message: "✅ Producto actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({
      message: "Error al actualizar producto",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
};

// ... todo tu código anterior igual ...

// ============================================================
// 🟢 OBTENER PRODUCTOS POR CATEGORÍA
// GET /api/productos/categoria/:id_categoria
// ============================================================
const obtenerPorCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;

    console.log(`🎯 Buscando productos para categoría ID: ${id_categoria}`);

    // Validar que id_categoria sea un número
    if (isNaN(id_categoria)) {
      return res.status(400).json({
        message: "❌ ID de categoría debe ser un número",
      });
    }

    // 🧩 Obtener productos por categoría
    const productos = await ProductosModel.getByCategoria(id_categoria);

    console.log(`✅ Encontrados ${productos.length} productos para categoría ${id_categoria}`);

    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos por categoría:", error);
    res.status(500).json({
      message: "Error al obtener productos por categoría",
      error: error.message,
    });
  }
};

// ============================================================
// 📤 Exportar funciones
// ============================================================
module.exports = {
  getProductos,
  postProductos,
  putProductos,
  deleteProductos,
  obtenerPorCategoria, // ✅ AHORA SÍ INCLUIDA
};