import express from 'express';
const router = express.Router();
import { getTeams, getTeam, createTeam, deleteTeam, updateTeam } from '../controllers/teams.controllers.js';

// Obtener todos los equipos
router.get('/teams', getTeams);

// Obtener un equipo por ID
router.get('/teams/:idTeam', getTeam);

// Crear un equipo
router.post('/teams', createTeam);

// Eliminar un equipo por ID
router.delete('/teams/:idTeam', deleteTeam);

// Actualizar un equipo por ID
router.put('/teams/:idTeam', updateTeam);

export default router;
