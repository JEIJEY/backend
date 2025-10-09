// 🛡️ MIDDLEWARE de validación de datos con Joi
// 📝 Propósito: Validar los datos de entrada en las peticiones HTTP
// 🚀 Uso: validateSchema(esquemaJoi) -> retorna middleware personalizado
module.exports = (schema) => {
  // 🔄 Retorna un middleware de Express reutilizable
  return (req, res, next) => {
    // ✅ Validar el cuerpo de la petición contra el esquema proporcionado
    const { error } = schema.validate(req.body, { abortEarly: false });

    // 🚫 Si hay errores de validación
    if (error) {
      // 📋 Extraer todos los mensajes de error de Joi
      const messages = error.details.map((err) => err.message);

      // 📤 Responder con error 400 y lista de errores
      return res.status(400).json({
        message: "Error de validación",
        errors: messages, // 🎯 Array con todos los errores específicos
      });
    }

    // ✅ Si la validación es exitosa, continuar al siguiente middleware
    next();
  };
};
