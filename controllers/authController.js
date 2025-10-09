// 📥 IMPORTACIONES de dependencias y modelos
const User = require("../models/nosql/User.js"); // 🗄️ Modelo de usuario de MongoDB
const bcrypt = require("bcryptjs"); // 🔐 Librería para comparar contraseñas
const jwt = require("jsonwebtoken"); // 🎫 Librería para generar tokens JWT

// ===============================
// 🆕 CONTROLADOR para registro de usuarios
// ===============================
const registerUser = async (req, res) => {
  try {
    // 📦 DESTRUCTURACIÓN: Extraer datos del cuerpo de la petición
    const { nombres, apellidos, cedula, fechaNacimiento, email, password } =
      req.body;

    // 🔍 VERIFICACIÓN: Comprobar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "El correo ya está registrado", // ❌ Error si el email existe
      });
    }

    // 👤 CREACIÓN: Instanciar nuevo usuario (el modelo se encarga de encriptar)
    const newUser = new User({
      nombres,
      apellidos,
      cedula,
      fechaNacimiento,
      email,
      password: password, // ⚠️ NO encriptar aquí - el pre-save hook lo hace
    });

    // 💾 GUARDADO: Persistir el usuario en la base de datos
    await newUser.save();

    // 🎫 GENERACIÓN: Crear token JWT con información del usuario
    const token = jwt.sign(
      {
        id: newUser._id, // 🔑 ID único de MongoDB
        email: newUser.email, // 📧 Email del usuario
        nombres: newUser.nombres, // 👤 Nombre para personalización
      },
      process.env.JWT_SECRET, // 🔒 Clave secreta desde variables de entorno
      { expiresIn: "24h" } // ⏰ Token expira en 24 horas
    );

    // 📤 RESPUESTA: Enviar confirmación exitosa al cliente
    res.status(201).json({
      message: "Usuario registrado correctamente", // ✅ Mensaje de éxito
      token: token, // 🎫 Token para autenticación futura
      user: {
        // 👤 Datos públicos del usuario (sin password)
        id: newUser._id,
        nombres: newUser.nombres,
        email: newUser.email,
      },
    });
  } catch (error) {
    // ❌ MANEJO DE ERRORES: Capturar y loguear cualquier excepción
    console.error("❌ Error al registrar:", error);
    res.status(500).json({
      message: "Error al registrar el usuario",
      error: error.message, // 📝 Detalle del error para debugging
    });
  }
};

// ===============================
// 🔐 CONTROLADOR para inicio de sesión
// ===============================
const loginUser = async (req, res) => {
  // 🟢 LOGGING: Depuración para verificar que la ruta se alcanza
  console.log("🟢 LOGIN USER - Ruta alcanzada");
  console.log("📦 Body recibido:", req.body);
  console.log("📧 Email:", req.body?.email);

  try {
    // 📦 DESTRUCTURACIÓN: Extraer credenciales del login
    const { email, password } = req.body;

    // 🔍 BÚSQUEDA: Buscar usuario por email en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado", // ❌ Usuario no existe
      });
    }

    // 🔐 COMPARACIÓN: Verificar contraseña con hash almacenado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Contraseña incorrecta", // ❌ Credenciales inválidas
      });
    }

    // 🎫 GENERACIÓN: Crear token JWT para sesión
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        nombres: user.nombres,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 📤 RESPUESTA: Enviar datos de sesión exitosa
    res.json({
      message: "Inicio de sesión exitoso", // ✅ Login correcto
      token: token, // 🎫 Token de autenticación
      user: {
        // 👤 Datos del usuario para el frontend
        id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
      },
    });
  } catch (error) {
    // ❌ MANEJO DE ERRORES: Capturar errores inesperados
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

// 📤 EXPORTACIÓN: Hacer disponibles los controladores para las rutas
module.exports = { registerUser, loginUser };
