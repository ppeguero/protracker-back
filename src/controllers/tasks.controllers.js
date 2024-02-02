import db from '../db.js'

//* Get the tasks with all their information from a specific user
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

//* Update the status of a task to completed
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

//* Create a task
const createTask = (req, res) => {
    const { nombre, descripcion, fecha_de_entrega, fecha_limite, ruta_documento, id_proyecto_id, id_estado_id, id_miembro_id } = req.body;

    const query = "INSERT INTO tarea (nombre, descripcion, fecha_de_entrega, fecha_limite, ruta_documento, id_proyecto_id, id_estado_id, id_miembro_id) VALUES (?, ?, ?, ?, ?, ?, 3, ?)";

    db.query(query, [nombre, descripcion, null, fecha_limite, null, null, id_estado_id, id_miembro_id], (err, result) => {
        if (err) {
            console.error("Error al insertar tarea:", err);
            res.status(500).send("Error interno del servidor");
        } else {
            console.log("Tarea insertada con éxito");
            res.status(200).send("Tarea insertada con éxito");
        }
    });
};


export default { 
    getTasksUser,
    updateTaskStatus,
    createTask,
};