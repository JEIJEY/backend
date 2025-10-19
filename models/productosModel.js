// ======================================================
// 📦 MODELO DE PRODUCTOS (MySQL)
// ======================================================

const getConexion = require("../config/mysql");

const ProductosModel = {
  // =======================================
  // 🟩 OBTENER TODOS LOS PRODUCTOS ACTIVOS
  // =======================================
  getAll: async () => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.stock,
        p.unidad_medida,
        p.precio_unitario,
        p.estado,
        p.fecha_creacion,
        p.fecha_actualizacion,
        c.nombre AS categoria_nombre,
        m.nombre AS marca_nombre,
        pr.nombre AS proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.estado = 1
      ORDER BY p.id_producto DESC
    `);
    return rows;
  },

  // =======================================
  // 🟦 CREAR NUEVO PRODUCTO
  // =======================================
  postProducto: async ({
    nombre,
    descripcion,
    stock,
    unidad_medida,
    precio_unitario,
    id_categoria,
    id_marca,
    id_proveedor,
    estado = 1,
  }) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      `
      INSERT INTO productos 
      (nombre, descripcion, stock, unidad_medida, precio_unitario, 
       id_categoria, id_marca, id_proveedor, estado, fecha_creacion) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        nombre,
        descripcion,
        stock,
        unidad_medida,
        precio_unitario,
        id_categoria,
        id_marca,
        id_proveedor,
        estado,
      ]
    );
    return rows.insertId;
  },

  // =======================================
  // 🟨 ACTUALIZAR PRODUCTO EXISTENTE
  // =======================================
  putProducto: async (
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
  ) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      `
      UPDATE productos 
      SET nombre=?, descripcion=?, stock=?, unidad_medida=?, precio_unitario=?, 
          id_categoria=?, id_marca=?, id_proveedor=?, estado=?, 
          fecha_actualizacion = NOW()
      WHERE id_producto=?
      `,
      [
        nombre,
        descripcion,
        stock,
        unidad_medida,
        precio_unitario,
        id_categoria,
        id_marca,
        id_proveedor,
        estado,
        id,
      ]
    );
    return rows.affectedRows;
  },

  // =======================================
  // 🟥 ELIMINAR PRODUCTO (Borrado lógico)
  // =======================================
  delProducto: async (id) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "UPDATE productos SET estado = 0 WHERE id_producto = ?",
      [id]
    );
    return rows.affectedRows;
  },

  // =======================================
  // 🟪 OBTENER PRODUCTOS POR CATEGORÍA
  // =======================================
  getByCategoria: async (id_categoria) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      `
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.stock,
        p.unidad_medida,
        p.precio_unitario,
        p.estado,
        p.fecha_creacion,
        p.fecha_actualizacion,
        c.nombre AS categoria_nombre,
        m.nombre AS marca_nombre,
        pr.nombre AS proveedor_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN marcas m ON p.id_marca = m.id_marca
      LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_categoria = ? AND p.estado = 1
      ORDER BY p.nombre ASC
      `,
      [id_categoria]
    );
    return rows;
  },
};

module.exports = ProductosModel;