const getConexion = require("../config/mysql");

const ProductosModel = {
  getAll: async () => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(`
      SELECT p.*, c.nombre AS categoria_nombre, pr.nombre AS proveedor_nombre
      FROM productos p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
    `);
    return rows;
  },

  postProducto: async ({ nombre, descripcion, stock, unidad_medida, precio_unitario, id_categoria, id_proveedor }) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "INSERT INTO productos (nombre, descripcion, stock, unidad_medida, precio_unitario, id_categoria, id_proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, stock, unidad_medida, precio_unitario, id_categoria, id_proveedor]
    );
    return rows.insertId;
  },

  putProducto: async (id, nombre, descripcion, stock, unidad_medida, precio_unitario, id_categoria, id_proveedor) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query(
      "UPDATE productos SET nombre=?, descripcion=?, stock=?, unidad_medida=?, precio_unitario=?, id_categoria=?, id_proveedor=? WHERE id_producto=?",
      [nombre, descripcion, stock, unidad_medida, precio_unitario, id_categoria, id_proveedor, id]
    );
    return rows.affectedRows;
  },

  delProducto: async (id) => {
    const conexion = await getConexion();
    const [rows] = await conexion.query("DELETE FROM productos WHERE id_producto = ?", [id]);
    return rows.affectedRows;
  },
};

module.exports = ProductosModel;
