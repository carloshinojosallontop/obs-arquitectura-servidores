import Post from "../models/post.model.js";
import HttpError from "../models/error.model.js";

// Controlador para crear un nuevo post
const create = async (req, res, next) => {
  const post = await Post.create(req.body);
  return res.status(201).json(post);
};

// Controlador para obtener todos los posts
const getAll = async (req, res, next) => {
  const posts = await Post.find();
  return res.status(200).json(posts);
};

// Controlador para obtener un post por ID
const getById = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new HttpError(404, "Post no encontrado");
  }
  return res.status(200).json(post);
};

// Controlador para actualizar un post por ID
const update = async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new HttpError(404, "Post no encontrado");
  }
  return res.status(200).json(post);
};

// Controlador para eliminar un post por ID
const remove = async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    throw new HttpError(404, "Post no encontrado");
  }
  return res.status(204).send({ message: "Post eliminado" });
};

export default { create, getAll, getById, update, remove };
