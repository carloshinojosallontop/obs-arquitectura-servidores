import Post from "../models/post.model.js";

const create = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ code: "bad_request", errors: error.errors });
    }
    res.status(500).json({ message: "Error al crear el post" });
  }
};

const getAll = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los posts" });
  }
};

const getById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ code: "not_found", message: "Post no encontrado" });
    res.status(200).json(post);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(404)
        .json({ code: "not_found", message: "Post no encontrado" });
    }
    return res.status(500).json({ message: "Error al obtener el post" });
  }
};

const update = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res
        .status(404)
        .json({ code: "not_found", message: "Post no encontrado" });
    }
    res.status(200).json(post);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ code: "bad_request", errors: err.errors });
    }
    if (err.name === "CastError") {
      return res
        .status(404)
        .json({ code: "not_found", message: "Post no encontrado" });
    }
    res.status(500).json({ message: "Error al actualizar el post" });
  }
};

const remove = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ code: "not_found", message: "Post no encontrado" });
    }
    res.status(204).send({ message: "Post eliminado" });
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(404)
        .json({ code: "not_found", message: "Post no encontrado" });
    }
    res.status(500).json({ message: "Error al eliminar el post" });
  }
};

export default { create, getAll, getById, update, remove };
