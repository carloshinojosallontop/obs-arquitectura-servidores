const isStr = (v) => typeof v === "string";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

export const PRIVS = new Set(["user", "admin"]);

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
  )
    errors.push("phone");

  if (!(isStr(e?.privileges) && PRIVS.has(e.privileges)))
    errors.push("privileges");

  if (
    !(
      isObj(e?.favorites) &&
      isStr(e.favorites.artist) &&
      isStr(e.favorites.food)
    )
  )
    errors.push("favorites");

  if (!(Array.isArray(e?.finished) && e.finished.every(isNum)))
    errors.push("finished");

  if (!(Array.isArray(e?.badges) && e.badges.every(isStr)))
    errors.push("badges");

  if (
    !(
      Array.isArray(e?.points) &&
      e.points.every((p) => isObj(p) && isNum(p.points) && isNum(p.bonus))
    )
  )
    errors.push("points");

  return { valid: errors.length === 0, errors };
};
