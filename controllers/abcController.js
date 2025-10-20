// ======================================================
// 📊 CONTROLADOR ABC - VERSIÓN FINAL FUNCIONAL Y CORREGIDA
// ======================================================

const getConexion = require('../config/mysql');

class ABCController {
  // ======================================================
  // 🔄 RECLASIFICAR INVENTARIO SEGÚN MÉTODO ABC
  // ======================================================
  async recalcularABC(req, res) {
    let conexion;
    try {
      conexion = await getConexion();
      console.log("🔄 Iniciando cálculo ABC...");

      // 1️⃣ Obtener productos
      const [productos] = await conexion.execute(`
        SELECT id_producto, nombre, stock, precio_unitario,
               (stock * precio_unitario) AS valor_total
        FROM productos
        WHERE estado = 1 AND stock > 0
        ORDER BY (stock * precio_unitario) DESC
      `);

      if (productos.length === 0) {
        return res.json({ success: false, message: "No hay productos para clasificar" });
      }

      // 2️⃣ Normalizar valores numéricos
      productos.forEach(p => {
        p.valor_total = parseFloat(p.valor_total) || 0;
      });

      // 3️⃣ Calcular valor total global
      const totalValor = productos.reduce((sum, p) => sum + p.valor_total, 0);
      console.log(`💰 Valor total: $${totalValor.toLocaleString()}`);

      // 4️⃣ Cálculo ABC con corrección
      let acumulado = 0;
      const stats = { A: 0, B: 0, C: 0 };

      console.log("\n🔢 CÁLCULO ABC CORREGIDO:");
      console.log("=================================================");

      for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const porcentaje = (producto.valor_total / totalValor) * 100;
        acumulado += porcentaje;

        // ✅ Lógica corregida — primer producto siempre es A
        let clase = "C";
        if (i === 0 || acumulado <= 80) {
          clase = "A";
          stats.A++;
        } else if (acumulado <= 95) {
          clase = "B";
          stats.B++;
        } else {
          stats.C++;
        }

        console.log(
          `#${i + 1} | ${producto.nombre.padEnd(20)} | ` +
          `Valor: $${producto.valor_total.toLocaleString().padStart(15)} | ` +
          `Porc: ${porcentaje.toFixed(2)}% | Acum: ${acumulado.toFixed(2)}% | Clase: ${clase}`
        );

        await conexion.execute(
          "UPDATE productos SET clase_abc = ? WHERE id_producto = ?",
          [clase, producto.id_producto]
        );
      }

      console.log("=================================================");
      console.log(`✅ FINAL: A=${stats.A}, B=${stats.B}, C=${stats.C}`);

      res.json({
        success: true,
        message: `Clasificados ${productos.length} productos correctamente.`,
        stats: { ...stats, total: productos.length, valorTotal: totalValor }
      });

    } catch (error) {
      console.error("❌ Error en cálculo ABC:", error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      if (conexion) await conexion.end();
    }
  }

  // ======================================================
  // 📋 OBTENER REPORTE ABC
  // ======================================================
  async obtenerReporteABC(req, res) {
    let conexion;
    try {
      conexion = await getConexion();

      const [productos] = await conexion.execute(`
        SELECT id_producto, nombre, stock, precio_unitario, clase_abc,
               (stock * precio_unitario) AS valor_total
        FROM productos
        WHERE estado = 1
        ORDER BY
          CASE clase_abc
            WHEN 'A' THEN 1
            WHEN 'B' THEN 2
            WHEN 'C' THEN 3
          END,
          (stock * precio_unitario) DESC
      `);

      const stats = {
        A: productos.filter(p => p.clase_abc === 'A').length,
        B: productos.filter(p => p.clase_abc === 'B').length,
        C: productos.filter(p => p.clase_abc === 'C').length,
        total: productos.length,
        valorTotal: productos.reduce((sum, p) => sum + parseFloat(p.valor_total), 0),
      };

      res.json({ success: true, productos, stats });

    } catch (error) {
      console.error("❌ Error obteniendo reporte ABC:", error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      if (conexion) await conexion.end();
    }
  }

  // ======================================================
  // ⚠️ OBTENER ALERTAS AUTOMÁTICAS
  // ======================================================
  async obtenerAlertasAutomaticas(req, res) {
    let conexion;
    try {
      conexion = await getConexion();

      const [stockCritico] = await conexion.execute(`
        SELECT id_producto, nombre, stock, precio_unitario, clase_abc,
               (stock * precio_unitario) AS valor_total
        FROM productos
        WHERE estado = 1
          AND stock <= 5
          AND clase_abc IN ('A', 'B')
        ORDER BY clase_abc, stock ASC
      `);

      const [necesitanReorden] = await conexion.execute(`
        SELECT id_producto, nombre, stock, precio_unitario, clase_abc
        FROM productos
        WHERE estado = 1
          AND stock BETWEEN 6 AND 15
          AND clase_abc IN ('A', 'B')
        ORDER BY clase_abc, stock ASC
      `);

      const [capitalOptimizable] = await conexion.execute(`
        SELECT SUM((stock - 30) * precio_unitario) AS capital_liberable
        FROM productos
        WHERE estado = 1
          AND clase_abc = 'C'
          AND stock > 30
      `);

      res.json({
        success: true,
        alertas: {
          criticos: stockCritico,
          reorden: necesitanReorden,
          capitalLiberable: capitalOptimizable[0]?.capital_liberable || 0,
        },
      });

    } catch (error) {
      console.error("❌ Error obteniendo alertas:", error);
      res.status(500).json({ success: false, error: error.message });
    } finally {
      if (conexion) await conexion.end();
    }
  }
}

module.exports = new ABCController();
