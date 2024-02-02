import express from 'express';
const router = express.Router();
import statisticsControllers from '../controllers/statistics.controllers.js';

router.get("/statistics/completed-tasks",statisticsControllers.completedTasks) //* Show the average number of tasks completed so far
router.get("/statistics/teams-working",statisticsControllers.teamsWorking) //* Show the total number of teams working
router.get("/statistics/projects-in-progress",statisticsControllers.projectsInProgress) //* Show the total number of teams working
router.get("/statistics/total-members",statisticsControllers.totalMembers) //* Show the total of members

export default router;