import multer from 'multer';
import { __dirname } from '../path.js';

// Configuración de multer para subir imágenes de productos
const storageProducts = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },

  destination: (req, file, cb) => {
    cb(null, `${__dirname}/public/img/products`);
  },
});

//middleware para subir archivos
export const uploadProds = multer({ storage: storageProducts });
