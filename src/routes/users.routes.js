import express from 'express';
const router = express.Router();
import { getUser, insertUser, updateUser, deleteUser } from "../controllers/users.controllers.js";

router.get("/user/:idUser?", getUser); // Obtener los usuarios con toda su información de un usuario específico
router.post("/user", insertUser); // Crear un nuevo usuario
router.put("/user/:idUser", updateUser); // Actualizar un usuario existente
router.delete("/user/:idUser", deleteUser); // Eliminar un usuario existente

export default router;
