import express from 'express';
const router = express.Router();
import taskController from '../controllers/tasks.controllers.js';

router.get("/tasks/:idUser",taskController.getTasksUser) //* Get the tasks with all their information from a specific user
router.put("/complete-task/:idTasks",taskController.updateTaskStatus) //* Update the status of a task to completed

export default router;