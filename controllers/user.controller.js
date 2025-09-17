import User from "../models/user.model.js";
import HttpError from "../models/error.model.js";
import bcrypt from "bcrypt";
import Session from "../models/session.model.js";

const create = async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    throw new HttpError(400, "El correo ya está registrado");
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  const user = await User.create(req.body);
  return res.status(201).json(user);
};

const login = async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw new HttpError(400, "email y password son requeridos");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Credenciales inválidas");
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new HttpError(401, "Credenciales inválidas");
  }
  const session = await Session.create({ user: user.id });
  res.cookie("session", session.id, { httpOnly: true });
  return res.status(200).json({ user, session });
};

const logout = async (req, res) => {
  const sessionId = req.cookies?.session; //
  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }
  res.clearCookie("session"); //
  res.status(204).json({ message: "Sesión cerrada" });
};

export default { create, login, logout };
