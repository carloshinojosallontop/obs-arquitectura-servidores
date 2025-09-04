import express from "express";
import {
  getOldestEmployee,
  getEmployees,
  getEmployeesByPage,
  getEmployeesByPrivilege,
  validateEmployee,
  addEmployee,
  getEmployeesByBadge,
  getEmployeeByName,
} from "./services/employees.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/api/employees", (req, res) => {
  const page = Number(req.query.page);
  const wantsUserOnly = String(req.query.user || "").toLowerCase() === "true";
  const badge =
    typeof req.query.badges === "string" ? req.query.badges.trim() : "";

  if (wantsUserOnly) return res.json(getEmployeesByPrivilege("user"));
  if (badge) return res.json(getEmployeesByBadge(badge));
  if (Number.isInteger(page) && page > 0)
    return res.json(getEmployeesByPage(page));

  return res.json(getEmployees());
});

app.get("/api/employees/oldest", (req, res) => {
  const oldest = getOldestEmployee();
  if (!oldest) {
    return res.status(404).json({ error: "No employees found" });
  }
  res.json(oldest);
});

app.get("/api/employees/:name", (req, res) => {
  const emp = getEmployeeByName(req.params.name);
  if (!emp) return res.status(404).json({ code: "not_found" });
  res.json(emp);
});

app.post("/api/employees", (req, res) => {
  const { valid } = validateEmployee(req.body);
  if (!valid) return res.status(400).json({ code: "bad_request" });
  const created = addEmployee(req.body);
  res.status(201).json(created);
});

export default app;
