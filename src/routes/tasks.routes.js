import express from 'express';
const router = express.Router();
import taskController from '../controllers/tasks.controllers.js';

router.get("/tasks/:idUser",taskController.getTasksUser) //* Get the tasks with all their information from a specific user
router.put("/complete-task/:idTasks",taskController.updateTaskStatus) //* Update the status of a task to completed
router.get("/statistics/completed-tasks",taskController.completedTasks) //* Show the average number of tasks completed so far

export default router;