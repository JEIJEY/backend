const mongoose = require("mongoose"); // 🗄️ ODM para MongoDB
const bcrypt = require("bcryptjs"); // 🔐 Librería para encriptar contraseñas

// 📋 ESQUEMA de usuario para MongoDB
const UserSchema = new mongoose.Schema(
  {
    // 👤 Información personal del usuario
    nombres: {
      type: String,
      required: true, // 🚫 Campo obligatorio
    },
    apellidos: {
      type: String,
      required: true, // 🚫 Campo obligatorio
    },
    cedula: {
      type: String,
      required: true, // 🚫 Campo obligatorio
      unique: true, // 🎯 No puede haber dos usuarios con misma cédula
    },
    fechaNacimiento: {
      type: Date,
      required: true, // 🚫 Campo obligatorio
    },
    // 📧 Información de contacto
    email: {
      type: String,
      required: true, // 🚫 Campo obligatorio
      unique: true, // 🎯 Email único en la base de datos
      lowercase: true, // 🔠 Convierte email a minúsculas automáticamente
    },
    // 🔒 Información de seguridad
    password: {
      type: String,
      required: true, // 🚫 Campo obligatorio
    },
    // 👨‍💼 Rol del usuario en el sistema
    role: {
      type: String,
      default: "user", // ⚡ Valor por defecto si no se especifica
      enum: ["user", "admin"], // 🎯 Solo permite estos valores
    },
  },
  {
    // ⏰ Configuraciones adicionales del esquema
    timestamps: true, // 📅 Crea createdAt y updatedAt automáticamente
    versionKey: false, // 🚫 Elimina el campo __v de versionado
  }
);

// 🔐 MIDDLEWARE: Se ejecuta ANTES de guardar el usuario
UserSchema.pre("save", async function (next) {
  // ✅ Solo encriptar si la contraseña fue modificada
  if (!this.isModified("password")) return next();

  try {
    // 🧂 Generar salt (factor de encriptación)
    const salt = await bcrypt.genSalt(10);
    // 🔒 Encriptar contraseña con el salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // ➡️ Continuar con el guardado
  } catch (error) {
    next(error); // ❌ Pasar error al siguiente middleware
  }
});

// 🔍 MÉTODO de instancia: Comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // ✅ Comparar contraseña proporcionada con la encriptada en la BD
  return await bcrypt.compare(candidatePassword, this.password);
};

// 📦 Exportar modelo para usar en otros archivos
module.exports = mongoose.model("users", UserSchema);
