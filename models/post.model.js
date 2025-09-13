import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      minlength: [6, "El título debe tener más de 5 caracteres"],
      trim: true,
    },
    text: {
      type: String,
      required: [true, "El texto es obligatorio"],
      minlength: [6, "El texto debe tener más de 5 caracteres"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "El autor es obligatorio"],
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
    versionKey: false, // sin __v
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = String(ret._id); // <-- string
        delete ret._id;
        return ret;
      },
    },
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
