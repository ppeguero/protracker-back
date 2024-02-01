import db from '../db.js'

//* Obtener las tareas con toda su información de un usuario específico
const getTasksUser = (req, res) => {
    db.query("CALL SP_GetUserTasks(?)",[req.params.idUser],(err,result) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            if (result.length > 0) {
                res.status(200).json(result[0]);
            } else {
                res.status(400).send('Datos no existentes');
            }
        }
    });
}

//* Actualizar el estado de una tarea a completado
const updateTaskStatus = (req, res) => {
    db.query("UPDATE tarea SET id_estado_id = 2 WHERE id_tarea = ?;", [req.params.idTasks], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            res.status(200).json({ message: "Tarea actualizada con éxito" });
        }
    });
};

export default { 
    getTasksUser,
    updateTaskStatus,
};