// Importamos mongoose para definir el esquema y el modelo
const mongoose = require("mongoose");

// Definimos el esquema del usuario con los campos del registro
const UserSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      required: true
    },
    apellidos: {
      type: String,
      required: true
    },
    cedula: {
      type: String,
      required: true,
      unique: true
    },
    fechaNacimiento: {
      type: Date,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
    versionKey: false // evita el campo "__v"
  }
);

// Exportamos el modelo
module.exports = mongoose.model("users", UserSchema);
