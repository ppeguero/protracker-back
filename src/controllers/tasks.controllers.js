import db from '../db.js'
import sanitizer from 'perfect-express-sanitizer';


//* Get the tasks with all their information from a specific user
const getTasksUser = (req, res) => {

    idUser = sanitizer.sanitize.prepareSanitize(req.params.idUser, {
        xss: true,
        noSql: true,
        sql: true,
        level: 5,
      });

    db.query("CALL SP_GetUserTasks(?)",[idUser],(err,result) => {
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

    idTasks = sanitizer.sanitize.prepareSanitize(req.params.idTasks, {
        xss: true,
        noSql: true,
        sql: true,
        level: 5,
      });

    db.query("UPDATE tarea SET id_estado_id = 2 WHERE id_tarea = ?;", [idTasks], (err, result) => {
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
    const { nombre, descripcion, fecha_de_entrega, fecha_limite, ruta_documento, id_proyecto_id, id_estado_id, id_miembro_id } = sanitizer.sanitize.prepareSanitize(req.body, {
        xss: true,
        noSql: true,
        sql: true,
        level: 5,
      });

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