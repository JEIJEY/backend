const Joi = require("joi");

// 🧾 Validación de registro
const registerValidation = Joi.object({
  nombres: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .trim()
    .required()
    .custom((value, helpers) => {
      // Evita valores como "   " o solo espacios
      if (value.trim().length === 0) {
        return helpers.error("any.empty");
      }

      // Asegura que haya al menos un nombre real (no solo una palabra vacía)
      const partes = value.trim().split(/\s+/);
      if (partes.length < 1 || !partes[0]) {
        return helpers.error("string.minNombre");
      }

      return value;
    })
    .messages({
      "string.empty": "El campo 'nombres' es obligatorio",
      "string.min": "El nombre debe tener al menos 3 caracteres",
      "string.max": "El nombre no puede superar los 50 caracteres",
      "string.pattern.base": "El nombre solo puede contener letras y espacios",
      "string.minNombre": "Debe ingresar al menos un nombre válido",
    }),

  apellidos: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    .trim()
    .required()
    .custom((value, helpers) => {
      // Elimina espacios múltiples y revisa si hay texto real
      const limpio = value.trim();

      if (limpio.length === 0) {
        return helpers.error("any.empty");
      }

      // Divide en palabras (apellidos)
      const partes = limpio.split(/\s+/);

      if (partes.length < 1) {
        return helpers.error("string.minApellido");
      }

      if (partes.length > 2) {
        return helpers.error("string.maxApellido");
      }

      return limpio;
    })
    .messages({
      "string.empty": "El campo 'apellidos' es obligatorio",
      "string.min": "El apellido debe tener al menos 3 caracteres",
      "string.max": "El apellido no puede superar los 50 caracteres",
      "string.pattern.base":
        "El apellido solo puede contener letras y espacios",
      "string.minApellido": "Debe ingresar al menos un apellido válido",
      "string.maxApellido": "Solo se permiten uno o dos apellidos",
    }),

  cedula: Joi.string()
    .trim()
    .pattern(/^\d+$/)
    .min(6)
    .max(10)
    .required()
    .custom((value, helpers) => {
      // Evita valores como "000000" o todos los dígitos iguales
      if (/^(\d)\1+$/.test(value)) {
        return helpers.error("string.repetitiveCedula");
      }

      // Evita valores con ceros al inicio (opcional, según tu país)
      if (/^0/.test(value)) {
        return helpers.error("string.leadingZero");
      }

      return value;
    })
    .messages({
      "string.empty": "La cédula es obligatoria",
      "string.min": "La cédula debe tener al menos 6 dígitos",
      "string.max": "La cédula no puede tener más de 10 dígitos",
      "string.pattern.base": "La cédula solo puede contener números",
      "string.repetitiveCedula":
        "La cédula no puede tener todos los dígitos iguales",
      "string.leadingZero": "La cédula no puede comenzar con cero",
    }),

  fechaNacimiento: Joi.date()
    .less("now")
    .required()
    .custom((value, helpers) => {
      const fecha = new Date(value);
      const hoy = new Date();

      // Calculamos la edad
      const edad =
        hoy.getFullYear() -
        fecha.getFullYear() -
        (hoy < new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())
          ? 1
          : 0);

      // ⛔ Si es menor de 18 años
      if (edad < 18) {
        return helpers.error("date.menorEdad");
      }

      // ⛔ Si es demasiado antiguo (más de 120 años)
      if (edad > 120) {
        return helpers.error("date.mayor120");
      }

      return value;
    })
    .messages({
      "date.base": "Debe ingresar una fecha válida",
      "any.required": "La fecha de nacimiento es obligatoria",
      "date.less": "La fecha de nacimiento no puede ser futura",
      "date.menorEdad": "Debe ser mayor de 18 años para registrarse",
      "date.mayor120": "La fecha de nacimiento no puede ser tan antigua",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: ["com", "net", "org", "edu", "co", "es"] } })
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required()
    .messages({
      "string.empty": "El correo es obligatorio",
      "string.email": "Debe ingresar un correo válido",
      "string.pattern.base": "El formato del correo no es válido",
    }),

  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%&*?._-]).+$")
    )
    .required()
    .messages({
      "string.min": "La contraseña debe tener mínimo 8 caracteres",
      "string.pattern.base":
        "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial",
      "string.empty": "La contraseña es obligatoria",
    }),
});

// 🧾 Validación de login
const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Debe ingresar un correo válido",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
  }),
});

module.exports = { registerValidation, loginValidation };
