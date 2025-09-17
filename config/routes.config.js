import express from "express";
import posts from "../controllers/post.controller.js";
import users from "../controllers/user.controller.js";
import session from "../middlewares/session.middleware.js";

const router = express.Router();

router.use("/posts", session.check);
router.get("/posts", posts.getAll);
router.post("/posts", posts.create);
router.get("/posts/:id", posts.getById);
router.patch("/posts/:id", posts.update);
router.delete("/posts/:id", posts.remove);

router.post("/users", users.create);

router.post("/login", users.login);

router.post("/logout", session.check, users.logout);

export default router;
