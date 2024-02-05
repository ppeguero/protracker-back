import connection from "../routes/db.js";
import sanitizer from 'perfect-express-sanitizer';


// Obtener todos los miembros con información relacionada
export const getMembers = (req, res) => {
  connection.query(
    `SELECT 
    miembro.id_miembro, 
    miembro.id_usuario_id, 
    miembro.id_equipo_id, 
    miembro.id_especialidad_id,
    usuario.id_usuario,  -- Agrega el ID de usuario
    usuario.id_rol_id,  -- Agrega el ID de usuario
    usuario.nombre AS nombre_usuario, 
    equipo.id_equipo,  -- Agrega el ID de equipo
    equipo.nombre AS nombre_equipo, 
    especialidad.id_especialidad,  -- Agrega el ID de especialidad
    especialidad.nombre AS nombre_especialidad 
  FROM miembro
  INNER JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
  INNER JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo
  INNER JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad`,
    (error, results) => {
      if (error) {
        console.error("Error al obtener los miembros:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.status(200).json(results);
      }
    }
  );
};

export const getMember = (req, res) => {
  const memberId = sanitizer.sanitize.prepareSanitize(req.params.idMember, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    `SELECT 
      miembro.id_miembro, 
      miembro.id_usuario_id, 
      miembro.id_equipo_id, 
      miembro.id_especialidad_id,
      usuario.id_usuario,  -- Agrega el ID de usuario
      usuario.nombre AS nombre_usuario, 
      equipo.id_equipo,  -- Agrega el ID de equipo
      equipo.nombre AS nombre_equipo, 
      especialidad.id_especialidad,  -- Agrega el ID de especialidad
      especialidad.nombre AS nombre_especialidad 
    FROM miembro
    INNER JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
    INNER JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo
    INNER JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad
    WHERE miembro.id_miembro = ?`,
    [memberId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener el miembro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Miembro no encontrado" });
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
};

export const getMemberWithId = (req, res) => {
  const memberId = sanitizer.sanitize.prepareSanitize(req.params.idMember, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    `SELECT 
      miembro.id_miembro, 
      miembro.id_usuario_id, 
      miembro.id_equipo_id, 
      miembro.id_especialidad_id,
      usuario.id_usuario,  -- Agrega el ID de usuario
      usuario.nombre AS nombre_usuario, 
      equipo.id_equipo,  -- Agrega el ID de equipo
      equipo.nombre AS nombre_equipo, 
      especialidad.id_especialidad,  -- Agrega el ID de especialidad
      especialidad.nombre AS nombre_especialidad 
    FROM miembro
    INNER JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
    INNER JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo
    INNER JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad
    WHERE miembro.id_usuario_id = ?`,
    [memberId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener el miembro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Miembro no encontrado" });
      } else {
        res.status(200).json(results);
      }
    }
  );
};

export const getMemberWithIdProjectAndUser = (req, res) => {
  const projectId = sanitizer.sanitize.prepareSanitize(req.params.projectId, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  const userId = sanitizer.sanitize.prepareSanitize(req.params.userId, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    `SELECT 
      miembro.id_miembro, 
      miembro.id_usuario_id, 
      miembro.id_equipo_id, 
      miembro.id_especialidad_id,
      usuario.id_usuario,  
      usuario.nombre AS nombre_usuario, 
      equipo.id_equipo,  
      equipo.nombre AS nombre_equipo, 
      especialidad.id_especialidad,  
      especialidad.nombre AS nombre_especialidad 
    FROM miembro
    INNER JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
    INNER JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo
    INNER JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad
    WHERE miembro.id_equipo_id = ? AND miembro.id_usuario_id = ?`,
    [projectId, userId],
    (error, results) => {
      if (error) {
        console.error("Error al obtener el miembro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Miembro no encontrado" });
      } else {
        res.status(200).json(results);
      }
    }
  );
};


export const getMemberWithIdTeam = (req, res) => {
  const idMemberTeam = sanitizer.sanitize.prepareSanitize(req.params.memberTeamId, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  // console.log(idMemberTeam);

  connection.query(
    `SELECT 
      miembro.id_miembro, 
      miembro.id_usuario_id, 
      miembro.id_equipo_id, 
      miembro.id_especialidad_id,
      usuario.id_usuario,  -- Agrega el ID de usuario
      usuario.nombre AS nombre_usuario, 
      equipo.id_equipo,  -- Agrega el ID de equipo
      equipo.nombre AS nombre_equipo, 
      especialidad.id_especialidad,  -- Agrega el ID de especialidad
      especialidad.nombre AS nombre_especialidad 
    FROM miembro
    INNER JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
    INNER JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo
    INNER JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad
    WHERE miembro.id_equipo_id = ?`,
    [idMemberTeam],
    (error, results) => {
      if (error) {
        console.error("Error al obtener el miembro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Miembro no encontrado" });
      } else {
        res.status(200).json(results);
      }
    }
  );
};

// Crear un miembro
export const createMember = (req, res) => {
  const { id_usuario_id, id_equipo_id, id_especialidad_id } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    "INSERT INTO miembro (id_usuario_id, id_equipo_id, id_especialidad_id) VALUES (?, ?, ?)",
    [id_usuario_id, id_equipo_id, id_especialidad_id],
    (error, results) => {
      if (error) {
        console.error("Error al crear el miembro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else {
        res.status(201).json({ id_miembro: results.insertId });
      }
    }
  );
};

// Eliminar un miembro por ID
export const deleteMember = (req, res) => {
  const memberId = sanitizer.sanitize.prepareSanitize(req.params.idMember, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    "DELETE FROM miembro WHERE id_miembro = ?",
    [memberId],
    (error, results) => {
      if (error) {
        console.error("Error al eliminar el miembro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Miembro no encontrado" });
      } else {
        res.status(204).send();
      }
    }
  );
};

// Actualizar un miembro por ID
export const updateMember = (req, res) => {
  const memberId = sanitizer.sanitize.prepareSanitize(req.params.idMember, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  const { id_usuario_id, id_equipo_id, id_especialidad_id } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    "UPDATE miembro SET id_usuario_id = ?, id_equipo_id = ?, id_especialidad_id = ? WHERE id_miembro = ?",
    [id_usuario_id, id_equipo_id, id_especialidad_id, memberId],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar el miembro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: "Miembro no encontrado" });
      } else {
        res.status(200).json({ id_miembro: memberId });
      }
    }
  );
};
