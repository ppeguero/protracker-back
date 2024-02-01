import db from '../db.js'

//* Obtener los usuarios con toda su información de un usuario específico
export const getUser = (req, res) => {
  const idUser = req.params.idUser;

  function getUserBase(err, result){
      if (err) {
        res.status(500).send(err);
      } else {
        if (result.length > 0) {
          res.status(200).send(result);
        } else {
          res.status(400).send("Usuario(s) no existentes");
        }
      }
  }

  // Utilizando INNER JOIN para obtener el rol del usuario
  idUser ?
  db.query(`
    SELECT usuario.*, rol.nombre AS nombre_rol
    FROM usuario
    INNER JOIN rol ON usuario.id_rol_id = rol.id_rol
    WHERE usuario.id_usuario = ${idUser}
  `, getUserBase)
  :
  db.query(`
    SELECT usuario.*, rol.nombre AS nombre_rol
    FROM usuario
    INNER JOIN rol ON usuario.id_rol_id = rol.id_rol
  `, getUserBase);
};


export const insertUser = (req, res) => {
  const { nombre, correo, contraseña, token, id_rol_id } = req.body;

  // Validaciones de datos (puedes agregar más validaciones según tus necesidades)
  if (!nombre || !correo || !contraseña || !id_rol_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  // Insertar el nuevo usuario en la base de datos
  const query = 'INSERT INTO usuario (nombre, correo, contraseña, token, id_rol_id) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, correo, contraseña, token, id_rol_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al insertar el usuario.' });
    }

    return res.status(201).json({ message: 'Usuario insertado con éxito.' });
  });
};

export const updateUser = (req, res) => {
  const idUser = req.params.idUser;
  const { nombre, correo, contraseña, token, id_rol_id } = req.body;

  // Validaciones de datos (puedes agregar más validaciones según tus necesidades)
  if (!idUser || !nombre || !correo || !contraseña || !id_rol_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  // Actualizar el usuario en la base de datos
  const query = 'UPDATE usuario SET nombre = ?, correo = ?, contraseña = ?, token = ?, id_rol_id = ? WHERE id_usuario = ?';
  db.query(query, [nombre, correo, contraseña, token, id_rol_id, idUser], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al actualizar el usuario.' });
    }

    return res.status(200).json({ message: 'Usuario actualizado con éxito.' });
  });
};

export const deleteUser = (req, res) => {
  const idUser = req.params.idUser;

  // Validaciones de datos (puedes agregar más validaciones según tus necesidades)
  if (!idUser) {
    return res.status(400).json({ message: 'Falta el ID de usuario.' });
  }

  // Eliminar el usuario de la base de datos
  const query = 'DELETE FROM usuario WHERE id_usuario = ?';
  db.query(query, [idUser], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al eliminar el usuario.' });
    }

    return res.status(200).json({ message: 'Usuario eliminado con éxito.' });
  });
};
