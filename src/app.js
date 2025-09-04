import express from "express";
import { getOldestEmployee, getEmployees, getEmployeesByPage } from "./services/employees.js";

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.get("/api/employees", (req, res) => {
  const N = Number(req.query.page);
  if (Number.isInteger(N) && N > 0) {
    return res.json(getEmployeesByPage(N));
  }
  res.json(getEmployees());
});

app.get("/api/employees/oldest", (req, res) => {
  const oldest = getOldestEmployee();
  if (!oldest) {
    return res.status(404).json({ error: "No employees found" });
  }
  res.json(oldest);
});

export default app;
