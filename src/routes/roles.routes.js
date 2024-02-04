import express from 'express';
const router = express.Router();
import { getRoles } from '../controllers/rol.controller.js';

router.get("/roles", getRoles) //* Get the tasks with all their information from a specific user

export default router;