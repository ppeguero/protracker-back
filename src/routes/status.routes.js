import express from 'express';
const router = express.Router();
import { getEstado } from '../controllers/status.controller.js';

router.get("/status", getEstado) //* Get the tasks with all their information from a specific user

export default router;