import express from 'express';
const router = express.Router();
import { getTasksUser, createTask, updateTaskStatus, getTasks} from '../controllers/tasks.controllers.js'; // Cambiado a tasksController

router.get("/tasks/:idUser", getTasksUser); // Cambiado a tasksController
router.get("/tasks", getTasks); // Cambiado a tasksController
router.post("/tasks/", createTask); // Cambiado a tasksController
router.put("/complete-task/:idTasks", updateTaskStatus); // Cambiado a tasksController

export default router;
