import crypto from "crypto";
import User from "../models/user.model.js";
import HttpError from "../models/error.model.js";


// Middleware de verificación de cuenta atado a /users
// - Si llega un GET /api/users con query ?token=...&id=..., valida y activa la cuenta.
// - En cualquier otro caso, deja pasar al siguiente handler.
const check = async (req, res, next) => {
  try {
    const isVerificationGet = req.method === "GET" && req.query?.token && req.query?.id;
    if (!isVerificationGet) return next();

    const { token, id } = req.query;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findById(id).select("+verificationTokenHash +verificationTokenExpires");
    if (!user) throw new HttpError(404, "Usuario no encontrado");

    if (user.active) {
      return res.status(200).json({ message: "La cuenta ya está activada", user });
    }

    if (!user.verificationTokenHash || !user.verificationTokenExpires) {
      throw new HttpError(400, "No hay verificación pendiente");
    }

    const expired = user.verificationTokenExpires.getTime() < Date.now();
    const match = crypto.timingSafeEqual(
      Buffer.from(user.verificationTokenHash, "hex"),
      Buffer.from(tokenHash, "hex")
    );

    if (!match) throw new HttpError(400, "Token de verificación inválido");
    if (expired) {
      user.verificationTokenHash = null;
      user.verificationTokenExpires = null;
      await user.save();
      throw new HttpError(400, "El token expiró. Solicita uno nuevo.");
    }

    user.active = true;
    user.verificationTokenHash = null;
    user.verificationTokenExpires = null;
    await user.save();

    return res.status(200).json({ message: "Cuenta verificada con éxito", user });
  } catch (err) {
    next(err);
  }
};

export default { check };
