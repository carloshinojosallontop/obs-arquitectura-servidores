import express from "express";
import posts from "../controllers/post.controller.js";
import users from "../controllers/user.controller.js";
import session from "../middlewares/session.middleware.js";
import verify from "../middlewares/verify.middleware.js";
import avatar from "../middlewares/upload.middleware.js";

const router = express.Router();

// Rutas para posts (protegidas por sesión)
router.use("/posts", session.check);
router.get("/posts", posts.getAll);
router.post("/posts", posts.create);
router.get("/posts/:id", posts.getById);
router.patch("/posts/:id", posts.update);
router.delete("/posts/:id", posts.remove);

// Rutas para usuarios
router.use("/users", verify.check);
router.post("/users", avatar.upload, users.create);
router.post("/login", users.login);
router.post("/logout", session.check, users.logout);

export default router;
