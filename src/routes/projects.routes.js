import express from 'express';
const router = express.Router();
import { getProjects, getProject, createProject, deleteProject, updateProject } from '../controllers/projects.controllers.js';

// Obtener todos los proyectos
router.get('/projects', getProjects);

// Obtener un proyecto por ID
router.get('/projects/:idProject', getProject);

// Crear un proyecto
router.post('/projects', createProject);

// Eliminar un proyecto por ID
router.delete('/projects/:idProject', deleteProject);

// Actualizar un proyecto por ID
router.put('/projects/:idProject', updateProject);

export default router;
