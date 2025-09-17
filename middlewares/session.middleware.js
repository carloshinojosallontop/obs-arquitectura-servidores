import mongoose from "mongoose";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import HttpError from "../models/error.model.js";

const check = async (req, res, next) => {
  const sessionId = req.cookies?.session;
  if (!sessionId) throw new HttpError(401, "unauthorized");
  if (!mongoose.isValidObjectId(sessionId))
    throw new HttpError(401, "unauthorized");

  const session = await Session.findById(sessionId);
  if (!session) throw new HttpError(401, "unauthorized");

  const user = await User.findById(session.user);
  if (!user) throw new HttpError(401, "unauthorized");

  req.user = user;
  next();
};

export default { check };
