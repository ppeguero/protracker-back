import connection from "../routes/db.js";

// Obtener todos los proyectos con información relacionada
export const getProjects = (req, res) => {
    const query = `
      SELECT 
        p.*,
        u.nombre AS nombre_usuario,
        e.nombre AS nombre_equipo,
        es.nombre AS nombre_estado
      FROM proyecto p
      INNER JOIN usuario u ON p.id_usuario_id = u.id_usuario
      INNER JOIN equipo e ON p.id_equipo_id = e.id_equipo
      INNER JOIN estado es ON p.id_estado_id = es.id_estado
    `;
  
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener proyectos.' });
      } else {
        res.status(200).json(results);
      }
    });
  };
  
  // Obtener un proyecto por ID con información relacionada
  export const getProject = (req, res) => {
    const projectId = req.params.id;
    const query = `
      SELECT 
        p.*,
        u.nombre AS nombre_usuario,
        e.nombre AS nombre_equipo,
        es.nombre AS nombre_estado
      FROM proyecto p
      INNER JOIN usuario u ON p.id_usuario_id = u.id_usuario
      INNER JOIN equipo e ON p.id_equipo_id = e.id_equipo
      INNER JOIN estado es ON p.id_estado_id = es.id_estado
      WHERE p.id_proyecto = ?
    `;
  
    connection.query(query, [projectId], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener el proyecto.' });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: 'Proyecto no encontrado.' });
        }
      }
    });
  };

// Crear un proyecto
export const createProject = (req, res) => {
  const { nombre, descripcion, fecha_inicio, id_usuario_id, id_estado_id, id_equipo_id } = req.body;
  const insertQuery = 'INSERT INTO proyecto (nombre, descripcion, fecha_inicio, id_usuario_id, id_estado_id, id_equipo_id) VALUES (?, ?, ?, ?, ?, ?)';
  
  connection.query(insertQuery, [nombre, descripcion, fecha_inicio, id_usuario_id, id_estado_id, id_equipo_id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear el proyecto.' });
    } else {
      res.status(201).json({ message: 'Proyecto creado exitosamente.' });
    }
  });
};

// Eliminar un proyecto por ID
export const deleteProject = (req, res) => {
  const projectId = req.params.idProject;
  const deleteQuery = 'DELETE FROM proyecto WHERE id_proyecto = ?';
  
  connection.query(deleteQuery, [projectId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el proyecto.' });
    } else {
      res.status(200).json({ message: 'Proyecto eliminado exitosamente.' });
    }
  });
};

// Actualizar un proyecto por ID
export const updateProject = (req, res) => {
    const projectId = req.params.idProject;
    const { nombre, descripcion, fecha_inicio, id_usuario_id, id_estado_id, id_equipo_id } = req.body;
  
    // Validar existencia del proyecto
    const checkProjectQuery = 'SELECT * FROM proyecto WHERE id_proyecto = ?';
  
    connection.query(checkProjectQuery, [projectId], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al validar la existencia del proyecto.' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: 'Proyecto no encontrado.' });
        } else {
          // Proyecto encontrado, realizar la actualización
          const updateQuery = 'UPDATE proyecto SET nombre = ?, descripcion = ?, fecha_inicio = ?, id_usuario_id = ?, id_estado_id = ?, id_equipo_id = ? WHERE id_proyecto = ?';
  
          connection.query(updateQuery, [nombre, descripcion, fecha_inicio, id_usuario_id, id_estado_id, id_equipo_id, projectId], (updateError, updateResults) => {
            if (updateError) {
              res.status(500).json({ error: 'Error al actualizar el proyecto.' });
            } else {
              res.status(200).json({ message: 'Proyecto actualizado exitosamente.' });
            }
          });
        }
      }
    });
  };
  
