import express from "express";
import posts from "../controllers/post.controller.js";

const router = express.Router();

router.get("/posts", posts.getAll);
router.post("/posts", posts.create);
router.get("/posts/:id", posts.getById);
router.patch("/posts/:id", posts.update);
router.delete("/posts/:id", posts.remove);

export default router;
