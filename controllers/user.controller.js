import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import HttpError from "../models/error.model.js";
import Session from "../models/session.model.js";

// Controlador para crear usuarios, iniciar sesión y cerrar sesión
const create = async (req, res) => {

  const { name, email, password, bio } = req.body || {};
  if (!name || !email || !password) {
    throw new HttpError(400, "name, email y password son requeridos");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new HttpError(400, "El correo ya está registrado");

  const passwordHash = await bcrypt.hash(password, 10);
  // genera un token de verificación
  const rawToken = crypto.randomBytes(32).toString("hex"); // Token sin procesar
  // hashea el token y guarda su hash y expiración en el usuario
  const verificationTokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  // expira en 5 minutos
  const verificationTokenExpires = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    bio,
    active: false,
    verificationTokenHash,
    verificationTokenExpires,
  });

  const verifyUrl = `/api/users?token=${rawToken}&id=${user.id}`;

  return res.status(201).json({
    message: "Usuario creado. Valida tu cuenta con la URL proporcionada.",
    user,
    verifyUrl,
  });
};

// Controlador para iniciar sesión
const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    throw new HttpError(400, "email y password son requeridos");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new HttpError(401, "Credenciales inválidas");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new HttpError(401, "Credenciales inválidas");

  if (!user.active) {
    throw new HttpError(
      403,
      "Cuenta no verificada. Valida tu correo antes de iniciar sesión."
    );
  }

  const session = await Session.create({ user: user._id });

  res.cookie("session", session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const safeUser = user.toJSON();
  return res.status(200).json({ user: safeUser, session });
};

// Controlador para cerrar sesión
const logout = async (req, res) => {
  const sessionId = req.cookies?.session;
  if (sessionId) await Session.findByIdAndDelete(sessionId);
  res.clearCookie("session");
  return res.status(200).json({ message: "Sesión cerrada" });
};

export default { create, login, logout };
