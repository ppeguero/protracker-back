import express from 'express'
import * as userController from '../controllers/userControllers.js';
const userRoutes = express.Router();

userRoutes.get('/users', userController.getUsers);
userRoutes.post('/user/email', userController.sendRecoveryCode);
userRoutes.get('/users/:id', userController.getUser);
userRoutes.post('/users', userController.createUser);
userRoutes.delete('/users/:id', userController.deleteUser);
userRoutes.patch('/users/:id', userController.updateUser);
userRoutes.post('/user/verify', userController.validateRecoveryCode);
userRoutes.patch('/user/restablish', userController.resetPassword);
userRoutes.get('/userCount', userController.contadorUsuario);
userRoutes.post('/login', userController.loginUser);
userRoutes.get('/users/proyect/:idUser', userController.userProjects);
userRoutes.get('/users/task/:idUser', userController.userTask);
userRoutes.get('/users/teams/:idUser', userController.userTeams);
userRoutes.get('/users/teams-task/:idUser', userController.userTeamTask);

export default userRoutes;
