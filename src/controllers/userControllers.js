import connection from "../routes/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sanitizer from 'perfect-express-sanitizer';

// obtener todos los usuarios
export const getUsers = (req, res) => {
  connection.query(`SELECT usuario.*, rol.nombre AS nombre_rol
  FROM usuario
  LEFT JOIN rol ON usuario.id_rol_id = rol.id_rol`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    res.status(200).json(results);
  });
};

// obtener un usuario
export const getUser = (req, res) => {
  const idUser = sanitizer.sanitize.prepareSanitize(req.params.id, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    `SELECT usuario.*, rol.nombre AS nombre_rol
    FROM usuario
    INNER JOIN rol ON usuario.id_rol_id = rol.id_rol
    WHERE usuario.id_usuario = ?`,
    [idUser],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado :(" });
      }

      res.status(200).json(results[0]);
    }
  );
};

// recovery code
function generateRecoveryCode() {
  const code = Math.floor(1000 + Math.random() * 9000);
  return code;
}

// buscar usuario por email
export const sendRecoveryCode = (req, res) => {
  const { correo } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query("SELECT * FROM usuario WHERE correo = ?", [correo], 
  (err, results)=> {
    if (err) {
      console.error(err);
      return res.status(500).json({message: "Error interno del servidor"})
    } else if (results.length === 0){
      return res.status(404).json({message: "Usuario no encontrado!"})
    } else {
      console.log("Se encontró el usuario")

      const reset_code = generateRecoveryCode(); // Genera un nuevo código
      const id_usuario = results[0].id_usuario;

      console.log(id_usuario)
      
      connection.query("UPDATE usuario SET token = ? WHERE id_usuario = ?", [reset_code, id_usuario],
      (codeError) => {
        if (codeError) {
          console.log(codeError)
          return res.status(500).json({message: "Error interno"})
        } 
        else {
          console.log("Se actualizó el reset code", reset_code)
          return res.status(200).json({ reset_code: reset_code, nombre: results[0].nombre });
        }
      })
    }
  })
}

export const validateRecoveryCode = (req, res) => {
  const { correo, token } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });
  console.log("Correo:", correo);
  console.log("Recovery Code enviado:", token);

  connection.query(
    "SELECT * FROM usuario WHERE correo = ?",
    [correo],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error Interno" });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Correo electrónico incorrecto",
        });
      }
      const user = results[0];
      const storedRecoveryCode = parseInt(user.token);
      const concatenatedRecoveryCode = parseInt(token);
      console.log("Recovery code guardado", storedRecoveryCode)

      if (concatenatedRecoveryCode === storedRecoveryCode) {
        res.status(200).json({ message: "Código de recuperación válido", correo });
      } else {
        return res
          .status(400)  
          .json({ message: "Código de recuperación incorrecto" });
      }
    }
  );
};

// recuperar la contraseña
export const resetPassword = (req, res) => {
  const {correo, contraseña} = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  console.log("La nueva contraseña es", contraseña)
  console.log("El email es", correo)
  
  const saltRounds = 10;
  bcrypt.hash(contraseña, saltRounds, (hashError, hash) => {
    if (hashError){
      console.error(hashError)
      return res.status(500).json({message: "Error interno del servidor :("})
    }
    connection.query(
      "UPDATE usuario SET contraseña = ?, token = NULL WHERE correo = ?", [hash, correo], 
      (updateError, resultsUpdate) => {
        if (updateError) {
          console.error(updateError);
          return res.status(500).json({ message: "Error Interno" });
        }
        res.status(200).json({ message: "Contraseña restablecida exitosamente"});
      }
    )
  })
}

// crear un usuario
export const createUser = (req, res) => {
  // Sanitizar los datos de entrada
  const { nombre, correo, contraseña, id_rol_id = 3 } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  // Validar el nombre de usuario si es necesario
  // if (
  //   nombre.length < 6 ||
  //   !/^[a-zA-Z0-9]+$/.test(nombre) ||
  //   /\s/.test(nombre)
  // ) {
  //   return res.status(400).json({ error: "El nombre de usuario no cumple con los requisitos." });
  // }

  const saltRounds = 15;

  // Verificar si el correo ya existe en la base de datos
  connection.query(
    "SELECT * FROM usuario WHERE correo = ?",
    [correo],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }

      // Si el correo ya existe, devolver un error
      if (results.length > 0) {
        return res.status(400).json({ message: "El correo electrónico ya se encuentra registrado" });
      }

      // Si el correo no existe, proceder con la inserción del usuario
      bcrypt.hash(contraseña, saltRounds, (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error Interno" });
        }
        connection.query(
          "INSERT INTO usuario (nombre, correo, contraseña, id_rol_id) VALUES (?, ?, ?, ?)",
          [nombre, correo, hash, id_rol_id],
          (err, results) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Error interno del servidor" });
            }

            res.status(201).json({ message: "Usuario creado exitosamente" });
          }
        );
      });
    }
  );
};


// eliminar un usuario
export const deleteUser = (req, res) => {
  const idUsuario = sanitizer.sanitize.prepareSanitize(req.params.id, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  connection.query(
    "DELETE FROM usuario WHERE id_usuario = ?",
    [idUsuario],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error interno del servidor" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "No se ha encontrado el usuario! :C" });
      }

      res
        .status(200)
        .json({ message: "El usuario se ha eliminado exitosamente" });
    }
  );
};


export const updateUser = (req, res) => {
  const idUsuario = sanitizer.sanitize.prepareSanitize(req.params.id, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  const { nombre, correo, contraseña, id_rol_id } = sanitizer.sanitize.prepareSanitize(req.body, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  const updatePromises = [];

  const updateField = (fieldName, value) => {
    return new Promise((resolve, reject) => {
      let updateQuery;
      if (fieldName === 'contraseña' && value) {
        const saltRounds = 10;
        bcrypt.hash(value, saltRounds, (hashError, hash) => {
          if (hashError) {
            console.error(hashError);
            reject("Error al cifrar la contraseña");
          }
          updateQuery = 'UPDATE usuario SET contraseña = ? WHERE id_usuario = ?';
          performUpdate(updateQuery, [hash, idUsuario]);
        });
      } else {
        updateQuery = `UPDATE usuario SET ${fieldName} = ? WHERE id_usuario = ?`;
        performUpdate(updateQuery, [value, idUsuario]);
      }

      function performUpdate(query, params) {
        connection.query(query, params, (err, results) => {
          if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('correo')) {
              reject("Correo electrónico duplicado");
            } else {
              reject(`Error al actualizar ${fieldName}`);
            }
          }
          resolve(`Campo ${fieldName} actualizado correctamente`);
        });
      }
    });
  };

  // Verificar si el nuevo correo ya existe en la base de datos
  if (correo) {
    connection.query(
      "SELECT * FROM usuario WHERE correo = ? AND id_usuario <> ?",
      [correo, idUsuario],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Si el correo ya existe para otro usuario, devolver un error
        if (results.length > 0) {
          return res.status(400).json({ error: 'Correo electrónico duplicado' });
        }

        // Si el correo no existe, continuar con las actualizaciones
        if (nombre) {
          updatePromises.push(updateField('nombre', nombre));
        }
        updatePromises.push(updateField('correo', correo));
        if (contraseña) {
          updatePromises.push(updateField('contraseña', contraseña));
        }
        if (id_rol_id) {
          updatePromises.push(updateField('id_rol_id', id_rol_id));
        }

        Promise.all(updatePromises)
          .then((messages) => {
            res.status(200).json({ messages });
          })
          .catch((error) => {
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
          });
      }
    );
  } else {
    // Si el correo no se proporciona, continuar con las actualizaciones sin verificar duplicados
    if (nombre) {
      updatePromises.push(updateField('nombre', nombre));
    }
    if (contraseña) {
      updatePromises.push(updateField('contraseña', contraseña));
    }
    if (id_rol_id) {
      updatePromises.push(updateField('id_rol_id', id_rol_id));
    }

    Promise.all(updatePromises)
      .then((messages) => {
        res.status(200).json({ messages });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
      });
  }
};


// Contador de usuarios
export const contadorUsuario = async (req, res) => {
  try {
    const userCount = await getUserCount();
    res.json({ userCount });
  } catch (error) {
    console.error('Error al obtener el recuento de usuarios', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para obtener el recuento de usuarios
const getUserCount = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT COUNT(*) AS userCount FROM usuario', (err, result) => {
      if (err) {
        reject(err);
      } else {
        const userCount = result[0].userCount;
        resolve(userCount);
      }
    });
  });
};

function generateAuthToken(user) {
  const secretKey = process.env.JWT_SECRET;
  const payload = {
    idUser: user.id_usuario,
    user_email: user.correo,
    user_name: user.nombre,
    user_type: user.id_rol_id,
    rol_name: user.nombre_rol,
    rol_permissions: user.permisos_rol
  };

  const token = jwt.sign(payload, secretKey);

  return token;
}


export const loginUser = (req, res) => {
  const correo = sanitizer.sanitize.prepareSanitize(req.body.email, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });
  const contraseña = sanitizer.sanitize.prepareSanitize(req.body.password, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });

  // console.log("El correo es: ", correo);
  // console.log("La contra es: ", contraseña);

  // const csrfTokenFromClient = req.headers['x-csrf-token']; // Assuming you set it as 'X-CSRF-Token' in the client
  // const csrfTokenFromServer = req.csrfToken();

  // if (csrfTokenFromClient !== csrfTokenFromServer) {
  //   return res.status(403).json({ error: 'CSRF Token Mismatch' });
  // }

  connection.query(
  `SELECT usuario.*, rol.nombre AS nombre_rol, rol.permisos AS permisos_rol
  FROM usuario
  LEFT JOIN rol ON usuario.id_rol_id = rol.id_rol
  WHERE correo = ?`,
    [correo],
    (err, results) => {
      // console.log('Resultados de la base de datos:', results);

      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'No se ha encontrado el usuario' });
      }
      const usuario = results[0];

      bcrypt.compare(contraseña, usuario.contraseña, (bcryptErr, isMatch) => {
        console.log('Comparando contraseñas:', isMatch);
        if (bcryptErr) {
          console.error(bcryptErr);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (!isMatch) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar un token de autenticación
        const token = generateAuthToken(usuario);

        res.status(200).json({ token, usuario });
      });
    }
  );
};

//* Obtener la info del los proyectos del usuario
export const userProjects = (req, res) => {
  const IdUser = sanitizer.sanitize.prepareSanitize(req.params.idUser, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });
  const query = `SELECT 
  p.*,
  e.nombre AS nombre_equipo,
  m.id_especialidad_id
  FROM proyecto p
  INNER JOIN equipo e ON p.id_equipo_id = e.id_equipo
  INNER JOIN miembro m ON p.id_equipo_id = m.id_equipo_id
  WHERE m.id_usuario_id = ? ORDER BY p.fecha_inicio ASC;`
  connection.query(query, [IdUser], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'No se ha encontrado el usuario' });
    }
    res.json(results);
  })
}

//* Obtener la info del las tareas del usuario
export const userTask = (req, res) => {
  const IdUser = sanitizer.sanitize.prepareSanitize(req.params.idUser, {
    xss: true,
    noSql: true,
    sql: true,
    level: 5,
  });
  const query = `SELECT 
  t.*,
  p.nombre AS nombre_proyecto,
  e.nombre AS nombre_equipo,
  m.id_especialidad_id
FROM tarea t
INNER JOIN proyecto p ON t.id_proyecto_id = p.id_proyecto
INNER JOIN equipo e ON p.id_equipo_id = e.id_equipo
INNER JOIN miembro m ON t.id_miembro_id = m.id_miembro
WHERE m.id_usuario_id = ?
ORDER BY t.fecha_limite ASC;`
  connection.query(query, [IdUser], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'No se ha encontrado el usuario' });
    }
    res.json(results);
  })
}