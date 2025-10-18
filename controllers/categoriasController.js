// ======================================================
// 🎯 CONTROLADOR DE CATEGORÍAS
// ======================================================

const categoriasModel = require("../models/categoriasModel");
const getConexion = require("../config/mysql");

// ======================================================
// 📦 OBJETO CONTROLADOR
// ======================================================
const categoriasController = {
  // ======================================================
  // 1️⃣ Obtener todas las categorías
  // ======================================================
  async obtenerTodas(req, res) {
    try {
      const categorias = await categoriasModel.getAll();
      res.status(200).json(categorias);
    } catch (error) {
      console.error("❌ Error al obtener categorías:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // ======================================================
  // 2️⃣ Obtener una categoría por ID
  // ======================================================
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await categoriasModel.getById(id);

      if (!categoria) {
        return res.status(404).json({ mensaje: "Categoría no encontrada" });
      }

      res.status(200).json(categoria);
    } catch (error) {
      console.error("❌ Error al obtener categoría:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // ======================================================
  // 3️⃣ Crear una nueva categoría o subcategoría
  // ======================================================
  async crear(req, res) {
    try {
      const { nombre, descripcion, parent_id } = req.body;

      if (!nombre || nombre.trim() === "") {
        return res
          .status(400)
          .json({ mensaje: "El campo 'nombre' es obligatorio" });
      }

      // ✅ parent_id puede ser nulo o numérico (para subcategorías)
      const nuevaCategoria = await categoriasModel.create({
        nombre,
        descripcion,
        parent_id: parent_id || null,
      });

      res.status(201).json({
        mensaje: parent_id
          ? "✅ Subcategoría creada correctamente"
          : "✅ Categoría raíz creada correctamente",
        data: nuevaCategoria,
      });
    } catch (error) {
      console.error("❌ Error al crear categoría:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // ======================================================
  // 4️⃣ Actualizar una categoría existente
  // ======================================================
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      if (!nombre || nombre.trim() === "") {
        return res
          .status(400)
          .json({ mensaje: "El campo 'nombre' es obligatorio" });
      }

      const categoriaActualizada = await categoriasModel.update(id, {
        nombre,
        descripcion,
      });

      res.status(200).json({
        mensaje: "✅ Categoría actualizada correctamente",
        data: categoriaActualizada,
      });
    } catch (error) {
      console.error("❌ Error al actualizar categoría:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // ======================================================
  // 5️⃣ Eliminar una categoría (borrado lógico + verificación)
  // ======================================================
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const conexion = await getConexion();

      // 🔍 Verificar si hay productos asociados a esta categoría
      const [productos] = await conexion.query(
        "SELECT COUNT(*) AS total FROM productos WHERE id_categoria = ?",
        [id]
      );

      if (productos[0].total > 0) {
        return res.status(400).json({
          mensaje:
            "❌ No se puede eliminar la categoría porque tiene productos asociados.",
        });
      }

      // 🗃️ Si no tiene productos → se desactiva la categoría (estado = 0)
      const [resultado] = await conexion.query(
        "UPDATE categorias SET estado = 0 WHERE id_categoria = ?",
        [id]
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ mensaje: "❌ Categoría no encontrada." });
      }

      res.status(200).json({
        mensaje: "✅ Categoría desactivada correctamente.",
      });
    } catch (error) {
      console.error("💥 Error al eliminar categoría:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        detalle: error.message,
      });
    }
  },

  // ======================================================
  // 🌳 6️⃣ CONTROLADOR - CATEGORÍAS JERÁRQUICAS (FASE 2)
  // ======================================================

  // ✅ Obtener categorías raíz (sin padre)
  async obtenerCategoriasRaiz(req, res) {
    try {
      const categorias = await categoriasModel.getCategoriasByParentId(null);
      res.status(200).json(categorias);
    } catch (error) {
      console.error("❌ Error al obtener categorías raíz:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // ✅ Obtener subcategorías de una categoría específica
  async obtenerSubcategorias(req, res) {
    try {
      const { id } = req.params;
      const categorias = await categoriasModel.getCategoriasByParentId(id);
      res.status(200).json(categorias);
    } catch (error) {
      console.error("❌ Error al obtener subcategorías:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // ✅ Obtener jerarquía completa de categorías y subcategorías
  async obtenerJerarquia(req, res) {
    try {
      const data = await categoriasModel.getJerarquiaCompleta();
      res.status(200).json(data);
    } catch (error) {
      console.error("❌ Error al obtener jerarquía:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};

// ======================================================
// 📤 EXPORTAR CONTROLADOR
// ======================================================
module.exports = categoriasController;