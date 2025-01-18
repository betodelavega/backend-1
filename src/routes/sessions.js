import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { current } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta para el login
router.post('/login', login);

// Ruta para validar al usuario logueado y devolver sus datos
router.get('/current', current, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
