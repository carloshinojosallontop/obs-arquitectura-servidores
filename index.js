import express from "express";
import router from "./config/routes.config.js";
import "./config/db.config.js";

const app = express();

const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());

// Routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
