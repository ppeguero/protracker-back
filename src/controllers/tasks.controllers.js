import db from '../db.js'
import sanitizer from 'perfect-express-sanitizer';


//* Get the tasks with all their information from a specific user
export const getTasksUser = (req, res) => {

    const idUser = sanitizer.sanitize.prepareSanitize(req.params.idUser, {
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

export const getTasksWithId = (req, res) => {
    const idTask = sanitizer.sanitize.prepareSanitize(req.params.idTask, {
      xss: true,
      noSql: true,
      sql: true,
      level: 5,
    });
  
    const sql = `
      SELECT tarea.id_tarea, tarea.nombre, tarea.descripcion, tarea.fecha_limite,
             tarea.id_proyecto_id, tarea.id_estado_id, tarea.id_miembro_id,
             proyecto.nombre AS nombre_proyecto, estado.nombre AS nombre_estado,
             miembro.id_usuario_id, miembro.id_equipo_id, miembro.id_especialidad_id,
             usuario.nombre AS nombre_usuario
      FROM tarea
      INNER JOIN proyecto ON tarea.id_proyecto_id = proyecto.id_proyecto
      INNER JOIN estado ON tarea.id_estado_id = estado.id_estado
      INNER JOIN miembro ON tarea.id_miembro_id = miembro.id_miembro
      INNER JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
      WHERE tarea.id_tarea = ?`;
  
    db.query(sql, [idTask], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.status(200).json(result);
      }
    });
  };
  
  
  
  

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

//* Update the status of a task to completed
export const getTasksInfoFull = (req, res) => {
    db.query(`
    SELECT 
    tarea.id_tarea,
    tarea.nombre AS nombre_tarea,
    tarea.descripcion,
    tarea.fecha_limite,
    proyecto.nombre AS nombre_proyecto,
    tarea.id_estado_id,
    estado.nombre AS nombre_estado,
    tarea.id_miembro_id,
    usuario.nombre AS nombre_usuario
FROM tarea
JOIN miembro ON tarea.id_miembro_id = miembro.id_miembro
JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
JOIN proyecto ON tarea.id_proyecto_id = proyecto.id_proyecto
JOIN estado ON tarea.id_estado_id = estado.id_estado;`, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            res.status(200).json(result);
        }
    });
};

//* Update the status of a task to completed
export const updateTaskStatus = (req, res) => {
    const idTasks = sanitizer.sanitize.prepareSanitize(req.params.idTasks, {
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
export const createTask = (req, res) => {
    const { nombre, descripcion, fecha_limite, id_proyecto_id, id_estado_id, id_miembro_id } = sanitizer.sanitize.prepareSanitize(req.body, {
        xss: true,
        noSql: true,
        sql: true,
        level: 5,
      });

     // Validar los datos recibidos
     if (!nombre || !descripcion || !fecha_limite || !id_proyecto_id || !id_estado_id || !id_miembro_id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para crear el equipo.' });
    }

    const query = "INSERT INTO tarea (nombre, descripcion, fecha_limite, id_proyecto_id, id_estado_id, id_miembro_id) VALUES (?, ?, ?, ?, 3, ?)";

    db.query(query, [nombre, descripcion, fecha_limite, id_proyecto_id, id_estado_id, id_miembro_id], (err, result) => {
        if (err) {
            console.error("Error al insertar tarea:", err);
            res.status(500).send("Error interno del servidor");
        } else {
            console.log("Tarea insertada con éxito");
            res.status(200).json("Tarea insertada con éxito");
        }
    });
};

// export default { 
//     getTasksUser,
//     updateTaskStatus,
//     createTask,
// };
