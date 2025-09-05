import { readFile } from "node:fs/promises";
import { validateEmployee } from "../validators/employee.js";

// Cargar datos iniciales
const dataUrl = new URL("../data/employees.json", import.meta.url);
const employees = JSON.parse(await readFile(dataUrl, "utf8"));

export const getEmployees = () => {
  return employees.slice();
};

export const getEmployeesByPage = (N = 1) => {
  if (!Number.isInteger(N) || N < 1) return [];
  const start = 2 * (N - 1);
  const end = start + 2;
  return employees.slice(start, end);
};

export const getOldestEmployee = () => {
  if (!Array.isArray(employees) || employees.length === 0) return null;

  let oldest = employees[0];
  for (const e of employees) {
    if (e.age > oldest.age) oldest = e;
  }
  return oldest;
};

export const getEmployeesByPrivilege = (priv = "user") => {
  return employees.filter((e) => e.privileges === priv);
};

export const getEmployeesByBadge = (badge) => {
  if (!badge) return [];
  const needle = String(badge).toLowerCase();
  return employees.filter(
    (e) =>
      Array.isArray(e.badges) &&
      e.badges.some((b) => String(b).toLowerCase() === needle)
  );
};

export const getEmployeeByName = (name) => {
  if (typeof name !== "string") return null;
  const n = name.trim().toLowerCase();
  const found = employees.find((e) => String(e.name).toLowerCase() === n);
  return found ?? null;
};

export const addEmployee = (e) => {
  const { valid } = validateEmployee(e);
  if (!valid) {
    const err = new Error("bad_request");
    err.status = 400;
    throw err;
  }
  const copy = JSON.parse(JSON.stringify(e));
  employees.push(copy);
  return copy;
};
