import connection from "../routes/db.js";

// Obtener todos los equipos
export const getTeams = (req, res) => {
  connection.query('SELECT * FROM equipo', (error, results) => {
    if (error) {
      console.error('Error al obtener equipos:', error);
      res.status(500).json({ success: false, message: 'Error al obtener equipos' });
    } else {
      res.status(200).json({ success: true, equipos: results });
    }
  });
};

// Obtener un equipo por ID
export const getTeam = (req, res) => {
  const { idTeam } = req.params;

  connection.query('SELECT * FROM equipo WHERE id_equipo = ?', [idTeam], (error, results) => {
    if (error) {
      console.error('Error al obtener equipo:', error);
      res.status(500).json({ success: false, message: 'Error al obtener equipo' });
    } else if (results.length === 0) {
      res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    } else {
      res.status(200).json({ success: true, equipo: results[0] });
    }
  });
};

// Crear un equipo
export const createTeam = (req, res) => {
  const { nombre } = req.body;

  connection.query('INSERT INTO equipo (nombre) VALUES (?)', [nombre], (error, results) => {
    if (error) {
      console.error('Error al crear equipo:', error);
      res.status(500).json({ success: false, message: 'Error al crear equipo' });
    } else {
      res.status(201).json({ success: true, message: 'Equipo creado con éxito', equipoId: results.insertId });
    }
  });
};

// Eliminar un equipo por ID
export const deleteTeam = (req, res) => {
  const { idTeam } = req.params;

  connection.query('DELETE FROM equipo WHERE id_equipo = ?', [idTeam], (error, results) => {
    if (error) {
      console.error('Error al eliminar equipo:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar equipo' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    } else {
      res.status(200).json({ success: true, message: 'Equipo eliminado con éxito' });
    }
  });
};

// Actualizar un equipo por ID
export const updateTeam = (req, res) => {
  const { idTeam } = req.params;
  const { nombre } = req.body;

  connection.query('UPDATE equipo SET nombre = ? WHERE id_equipo = ?', [nombre, idTeam], (error, results) => {
    if (error) {
      console.error('Error al actualizar equipo:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar equipo' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    } else {
      res.status(200).json({ success: true, message: 'Equipo actualizado con éxito' });
    }
  });
};

export const getMemberOfTeamById = (req, res) => {
  const { idTeam } = req.params;

  connection.query('SELECT miembro.id_miembro,usuario.nombre AS nombre_miembro,especialidad.nombre AS especialidad FROM miembro JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad WHERE equipo.id_equipo = ?;', [idTeam], (error, results) => {
    if (error) {
      console.error('Error al obtener miembros del equipo:', error);
      res.status(500).json({ success: false, message: 'Error al obtener miembros del equipo' });
    } else {
      res.status(200).json({ success: true, miembros: results });
    }
  });
}

