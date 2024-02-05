import express from 'express';
const router = express.Router();
import { getTasksUser, getTasksWithId, deleteTask, getTasksInfoFull, createTask, updateTask, updateTaskStatus, getTasks} from '../controllers/tasks.controllers.js'; // Cambiado a tasksController

router.get("/tasks/:idUser", getTasksUser); // Cambiado a tasksController
router.get("/tasks", getTasks); // Cambiado a tasksController
router.get("/tasks-info", getTasksInfoFull); // Cambiado a tasksController
router.get("/task/:idTask", getTasksWithId); // Cambiado a tasksController
router.post("/tasks/", createTask); // Cambiado a tasksController
router.patch("/tasks/:idTask", updateTask); // Cambiado a tasksController
router.put("/complete-task/:idTasks", updateTaskStatus); // Cambiado a tasksController
router.delete("/tasks/:idTasks", deleteTask); // Cambiado a tasksController
export default router;
