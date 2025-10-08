const mongoose = require("mongoose");
const bcrypt = require('bcryptjs'); // ← AGREGAR ESTA LÍNEA

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
    },
    role: { // ← AGREGAR ESTE CAMPO NUEVO
      type: String,
      default: 'user',
      enum: ['user', 'admin'] // roles permitidos
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// ← AGREGAR ESTOS MÉTODOS NUEVOS:

// Encriptar password antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("users", UserSchema);