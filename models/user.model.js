import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor ingresa un correo válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      trim: true,
      minlength: 6,
      maxlength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
