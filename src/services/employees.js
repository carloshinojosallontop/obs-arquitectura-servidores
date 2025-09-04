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
