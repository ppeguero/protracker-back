import connection from "../routes/db.js";
import sanitizer from 'perfect-express-sanitizer';


// Obtener todos los equipos con el id_usuario_id mediante INNER JOIN
export const getTeams = (req, res) => {
  connection.query('SELECT equipo.id_equipo, equipo.nombre, equipo.id_usuario_id, usuario.nombre AS nombreUsuario FROM equipo INNER JOIN usuario ON equipo.id_usuario_id = usuario.id_usuario', (error, results) => {
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
  const { idTeam } = sanitizer.sanitize.prepareSanitize(req.params, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

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
  const { nombre, id_usuario_id } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query('INSERT INTO equipo (nombre, id_usuario_id) VALUES (?, ?)', [nombre, id_usuario_id], (error, results) => {
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
  const { idTeam } = sanitizer.sanitize.prepareSanitize(req.params, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

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
  const { idTeam } = sanitizer.sanitize.prepareSanitize(req.params, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  const { nombre, id_usuario_id } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query('UPDATE equipo SET nombre = ?, id_usuario_id = ? WHERE id_equipo = ?', [nombre, id_usuario_id, idTeam], (error, results) => {
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
  const { idTeam } = sanitizer.sanitize.prepareSanitize(req.params, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query('SELECT miembro.id_miembro,usuario.nombre AS nombre_miembro,especialidad.nombre AS especialidad FROM miembro JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad WHERE equipo.id_equipo = ?;', [idTeam], (error, results) => {
    if (error) {
      console.error('Error al obtener miembros del equipo:', error);
      res.status(500).json({ success: false, message: 'Error al obtener miembros del equipo' });
    } else {
      res.status(200).json({ success: true, miembros: results });
    }
  });
}

