import express from "express";
import {
  getOldestEmployee,
  getEmployees,
  getEmployeesByPage,
  getEmployeesByPrivilege,
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
    return res.status(404).json({ code: "not_found" });
  }
  res.json(oldest);
});

app.get("/api/employees/:name", (req, res) => {
  const emp = getEmployeeByName(req.params.name);
  if (!emp) return res.status(404).json({ code: "not_found" });
  res.json(emp);
});

app.post("/api/employees", (req, res, next) => {
  try {
    const created = addEmployee(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err?.status === 400) {
      return res.status(400).json({ code: "bad_request" });
    }
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ code: "not_found" });
});

app.use((err, req, res, next) => {
  console.error(err);

  // JSON inválido al parsear body
  if (err?.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ code: "bad_request", detail: "invalid_json" });
  }

  const status = Number.isInteger(err?.status)
    ? err.status
    : Number.isInteger(err?.statusCode)
    ? err.statusCode
    : 500;

  const payload =
    status >= 500
      ? { code: "internal_error" }
      : { code: "error", message: err?.message ?? undefined };

  return res.status(status).json(payload);
});

export default app;
