// ======================================================
// 🎯 CONTROLADOR DE CATEGORÍAS
// ======================================================

const categoriasModel = require("../models/categoriasModel");

// El controlador se encarga de recibir las peticiones HTTP,
// ejecutar las funciones del modelo y responder con JSON.
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
  // 3️⃣ Crear una nueva categoría
  // ======================================================
  async crear(req, res) {
    try {
      const { nombre, descripcion } = req.body;

      if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ mensaje: "El campo 'nombre' es obligatorio" });
      }

      const nuevaCategoria = await categoriasModel.create({ nombre, descripcion });
      res.status(201).json({
        mensaje: "Categoría creada correctamente",
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
        return res.status(400).json({ mensaje: "El campo 'nombre' es obligatorio" });
      }

      const categoriaActualizada = await categoriasModel.update(id, { nombre, descripcion });
      res.status(200).json({
        mensaje: "Categoría actualizada correctamente",
        data: categoriaActualizada,
      });
    } catch (error) {
      console.error("❌ Error al actualizar categoría:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // ======================================================
  // 5️⃣ Eliminar una categoría
  // ======================================================
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await categoriasModel.remove(id);
      res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
    } catch (error) {
      console.error("❌ Error al eliminar categoría:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};

module.exports = categoriasController;
