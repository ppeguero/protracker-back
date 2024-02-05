import express from 'express';
const router = express.Router();
import { getMembers, getMember, getMemberWithIdProjectAndUser, getMemberWithIdTeam, getMemberWithId, createMember, deleteMember, updateMember } from '../controllers/members.controllers.js';

// Obtener todos los miembros
router.get('/members', getMembers);

// Obtener un miembro por ID
router.get('/members/:idMember', getMember);

// Obtener un miembro por ID del equipo
router.get('/members-team/:memberTeamId', getMemberWithIdTeam);

// Obtener un miembro por ID
router.get('/teams-member/:idMember', getMemberWithId);

// Obtener un miembro por ID del proyecto y usuario
router.get('/members-project-user/:projectId/:userId', getMemberWithIdProjectAndUser);


// Crear un miembro
router.post('/members', createMember);

// Eliminar un miembro por ID
router.delete('/members/:idMember', deleteMember);

// Actualizar un miembro por ID
router.put('/members/:idMember', updateMember);

export default router;
