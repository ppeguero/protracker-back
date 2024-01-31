import express from 'express';
const router = express.Router();
import taskController from '../controllers/tasks.controllers.js';

router.get("/tasks/:idUser",taskController.getTasksUser) //* Obtener las tareas con toda su información de un usuario específico
router.put("/complete-task/:idTasks",taskController.updateTaskStatus) //* Actualizar el estado de una tarea a completado

export default router;