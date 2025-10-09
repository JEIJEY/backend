const Joi = require("joi"); // 📋 Librería para validación de datos

// 🧾 ESQUEMA de validación para registro de usuarios
const registerValidation = Joi.object({
  // 👤 Validación del campo nombres
  nombres: Joi.string()
    .min(3) // 📏 Mínimo 3 caracteres
    .max(50) // 📏 Máximo 50 caracteres
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/) // 🔤 Solo letras y espacios
    .trim() // ✂️ Elimina espacios al inicio y final
    .required() // 🚫 Campo obligatorio
    .custom((value, helpers) => {
      // 🚫 Evita valores con solo espacios
      if (value.trim().length === 0) {
        return helpers.error("any.empty");
      }

      // ✅ Verifica que haya al menos un nombre válido
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

  // 👤 Validación del campo apellidos
  apellidos: Joi.string()
    .min(3) // 📏 Mínimo 3 caracteres
    .max(50) // 📏 Máximo 50 caracteres
    .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/) // 🔤 Solo letras y espacios
    .trim() // ✂️ Elimina espacios al inicio y final
    .required() // 🚫 Campo obligatorio
    .custom((value, helpers) => {
      // 🚫 Evita valores con solo espacios
      const limpio = value.trim();
      if (limpio.length === 0) {
        return helpers.error("any.empty");
      }

      // ✅ Valida cantidad de apellidos (1-2)
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

  // 🆔 Validación del campo cédula
  cedula: Joi.string()
    .trim() // ✂️ Elimina espacios
    .pattern(/^\d+$/) // 🔢 Solo números
    .min(6) // 📏 Mínimo 6 dígitos
    .max(10) // 📏 Máximo 10 dígitos
    .required() // 🚫 Campo obligatorio
    .custom((value, helpers) => {
      // 🚫 Evita dígitos repetidos (ej: 111111)
      if (/^(\d)\1+$/.test(value)) {
        return helpers.error("string.repetitiveCedula");
      }

      // 🚫 Evita cédulas que empiecen con cero
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

  // 📅 Validación del campo fecha de nacimiento
  fechaNacimiento: Joi.date()
    .less("now") // ⏰ No puede ser fecha futura
    .required() // 🚫 Campo obligatorio
    .custom((value, helpers) => {
      const fecha = new Date(value);
      const hoy = new Date();

      // 🎂 Calcula la edad exacta
      const edad =
        hoy.getFullYear() -
        fecha.getFullYear() -
        (hoy < new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate())
          ? 1
          : 0);

      // 🚫 Valida edad mínima (18 años)
      if (edad < 18) {
        return helpers.error("date.menorEdad");
      }

      // 🚫 Valida edad máxima (120 años)
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

  // 📧 Validación del campo email
  email: Joi.string()
    .trim() // ✂️ Elimina espacios
    .lowercase() // 🔠 Convierte a minúsculas
    .email({ tlds: { allow: ["com", "net", "org", "edu", "co", "es"] } }) // 🌐 Dominios permitidos
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) // 📧 Formato email válido
    .required() // 🚫 Campo obligatorio
    .messages({
      "string.empty": "El correo es obligatorio",
      "string.email": "Debe ingresar un correo válido",
      "string.pattern.base": "El formato del correo no es válido",
    }),

  // 🔐 Validación del campo contraseña
  password: Joi.string()
    .min(8) // 📏 Mínimo 8 caracteres
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%&*?._-]).+$")
    ) // 🔒 Requisitos de seguridad
    .required() // 🚫 Campo obligatorio
    .messages({
      "string.min": "La contraseña debe tener mínimo 8 caracteres",
      "string.pattern.base":
        "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial",
      "string.empty": "La contraseña es obligatoria",
    }),
});

// 🔐 ESQUEMA de validación para inicio de sesión
const loginValidation = Joi.object({
  // 📧 Validación simplificada para login
  email: Joi.string().email().required().messages({
    "string.email": "Debe ingresar un correo válido",
  }),

  // 🔐 Validación básica de contraseña para login
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
  }),
});

// 📤 Exportar esquemas de validación
module.exports = { registerValidation, loginValidation };
