import multer from "multer";
import path from "path";
import fs from "fs";

// Carpeta donde se guardan los avatares
const avatarDir = path.resolve("uploads/avatars");
fs.mkdirSync(avatarDir, { recursive: true });

// funcion para verificar y renombrar archivos
function checkName(dir, originalName = "avatar") {
  const { name, ext } = path.parse(originalName);
  const base = name || "avatar";
  const extension = ext || "";
  let newFileName = `${base}${extension}`;
  let i = 1;
  while (fs.existsSync(path.join(dir, newFileName))) {
    newFileName = `${base}-${i}${extension}`;
    i += 1;
  }
  return newFileName;
}

// Configuración para almacenar los archivos en el sistema de archivos y renombrarlos si ya existen
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const finalName = checkName(avatarDir, file.originalname);
    cb(null, finalName);
  },
});

// una sola imagen por solicitud, con el campo 'avatar'
const upload = multer({ storage }).single("avatar");

export default { upload };
