// Importamos el modelo de usuario y bcrypt
const User = require("../models/nosql/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Controlador para registro
// ===============================
const registerUser = async (req, res) => {
  try {
    const { nombres, apellidos, cedula, fechaNacimiento, email, password } =
      req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 🚨 CORRECCIÓN: NO encriptar aquí - el modelo User.js ya lo hace
    // Crear un nuevo usuario (el modelo se encarga de encriptar el password)
    const newUser = new User({
      nombres,
      apellidos,
      cedula,
      fechaNacimiento,
      email,
      password: password, // ← El modelo lo encripta automáticamente
    });

    await newUser.save();

    // Generar token JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        nombres: newUser.nombres
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: "Usuario registrado correctamente",
      token: token,
      user: {
        id: newUser._id,
        nombres: newUser.nombres,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// ===============================
// Controlador para login
// ===============================
const loginUser = async (req, res) => {
  console.log("🟢 LOGIN USER - Ruta alcanzada");
  console.log("📦 Body recibido:", req.body);
  console.log("📧 Email:", req.body?.email);
  try {
    const { email, password } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        nombres: user.nombres
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token: token,
      user: {
        id: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};

// Exportar los controladores
module.exports = { registerUser, loginUser };