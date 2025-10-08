const User = require("../models/nosql/User.js");
const bcrypt = require("bcryptjs");

// ===============================
// Controlador para registro
// ===============================
const registerUser = async (req, res) => {
  try {
    const { nombres, apellidos, cedula, fechaNacimiento, email, password } =
      req.body;

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      nombres,
      apellidos,
      cedula,
      fechaNacimiento,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar:", error);

    // 🧠 Captura de error por duplicado (cédula o correo)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `El ${field} ya está registrado. Usa otro.`,
      });
    }

    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// ===============================
// Controlador para login
// ===============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Éxito
    res.json({
      message: "Inicio de sesión exitoso",
      user: {
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
