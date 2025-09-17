import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./config/routes.config.js";
import HttpError from "./models/error.model.js";
import "./config/db.config.js";

const app = express();

const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api", router);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error); 
  if (error.name === "CastError") {
    return res.status(404).json({ message: "Recurso no encontrado" });
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ errors: messages });
  }
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }
  res.status(500).json({ message: "Error interno del servidor" });
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
