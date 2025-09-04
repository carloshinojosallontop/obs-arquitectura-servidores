import { readFile } from "node:fs/promises";

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

/** NUEVO: filtrar por badge (case-insensitive) */
export const getEmployeesByBadge = (badge) => {
  if (!badge) return [];
  const needle = String(badge).toLowerCase();
  return employees.filter(
    (e) =>
      Array.isArray(e.badges) &&
      e.badges.some((b) => String(b).toLowerCase() === needle)
  );
};

/** Buscar empleado por nombre (match exacto) */
export const getEmployeeByName = (name) => {
  if (typeof name !== "string") return null;
  const found = employees.find(e => e.name === name);
  return found ?? null;
};

/* ================== NUEVO: VALIDACIÓN Y ALTA EN MEMORIA ================== */

const isStr = (v) => typeof v === "string";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const PRIVS = new Set(["user", "admin"]);

/**
 * Valida que el objeto cumpla el mismo formato que los empleados del JSON.
 * Devuelve { valid: boolean, errors: string[] }
 */
export const validateEmployee = (e) => {
  const errors = [];

  if (!isObj(e)) errors.push("root");
  if (!isStr(e?.name)) errors.push("name");
  if (!isNum(e?.age)) errors.push("age");

  if (
    !(
      isObj(e?.phone) &&
      isStr(e.phone.personal) &&
      isStr(e.phone.work) &&
      isStr(e.phone.ext)
    )
  ) {
    errors.push("phone");
  }

  if (!(isStr(e?.privileges) && PRIVS.has(e.privileges))) {
    errors.push("privileges");
  }

  if (
    !(
      isObj(e?.favorites) &&
      isStr(e.favorites.artist) &&
      isStr(e.favorites.food)
    )
  ) {
    errors.push("favorites");
  }

  if (!(Array.isArray(e?.finished) && e.finished.every(isNum))) {
    errors.push("finished");
  }

  if (!(Array.isArray(e?.badges) && e.badges.every(isStr))) {
    errors.push("badges");
  }

  if (
    !(
      Array.isArray(e?.points) &&
      e.points.every((p) => isObj(p) && isNum(p.points) && isNum(p.bonus))
    )
  ) {
    errors.push("points");
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Agrega un empleado al array en memoria (se pierde al reiniciar el proceso).
 * Asume que ya fue validado con validateEmployee.
 */
export const addEmployee = (e) => {
  const copy = JSON.parse(JSON.stringify(e)); // copia defensiva
  employees.push(copy);
  return copy;
};
