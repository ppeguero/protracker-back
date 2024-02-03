import express from 'express';
const router = express.Router();
import { getCSRFToken } from '../controllers/csrf-controllers.js'; // Ajusta la ruta según tu estructura

// Obtener el token CSRF
router.get('/csrf-token', getCSRFToken);


export default router;
