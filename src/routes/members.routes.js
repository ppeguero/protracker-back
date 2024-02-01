import express from 'express';
const router = express.Router();
import { getMembers, getMember, createMember, deleteMember, updateMember } from '../controllers/members.controllers.js';

// Obtener todos los miembros
router.get('/members', getMembers);

// Obtener un miembro por ID
router.get('/members/:idMember', getMember);

// Crear un miembro
router.post('/members', createMember);

// Eliminar un miembro por ID
router.delete('/members/:idMember', deleteMember);

// Actualizar un miembro por ID
router.put('/members/:idMember', updateMember);

export default router;
