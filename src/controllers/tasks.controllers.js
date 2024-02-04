import db from '../db.js'

//* Get the tasks with all their information from a specific user
export const getTasksUser = (req, res) => {
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
export const getTasks = (req, res) => {
    db.query("SELECT * FROM tarea", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
};

// Crear un equipo
export const createTask = (req, res) => {
    const { nombre, descripcion, fecha_limite, id_proyecto_id, id_estado_id, id_miembro_id } = req.body;

    // Validar los datos recibidos
    if (!nombre || !descripcion || !fecha_limite || !id_proyecto_id || !id_estado_id || !id_miembro_id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para crear el equipo.' });
    }

    // Realizar la inserción en la base de datos
    db.query(
        "INSERT INTO tarea (nombre, descripcion, fecha_limite, id_proyecto_id, id_estado_id, id_miembro_id) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, descripcion, fecha_limite, id_proyecto_id, id_estado_id, id_miembro_id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al crear la tarea.' });
            } else {
                return res.status(201).json({ success: true, taskId: result.insertId });
            }
        }
    );
};
  
//* Update the status of a task to completed
export const updateTaskStatus = (req, res) => {
    db.query("UPDATE tarea SET id_estado_id = 2 WHERE id_tarea = ?;", [req.params.idTasks], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            res.status(200).json({ message: "Tarea actualizada con éxito" });
        }
    });
};
