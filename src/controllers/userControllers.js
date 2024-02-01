import connection from "../routes/db.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


// obtener todos los usuarios
export const getUsers = (req, res) => {
  connection.query(`SELECT usuario.*, rol.nombre AS nombre_rol
  FROM usuario
  INNER JOIN rol ON usuario.id_rol_id = rol.id_rol`, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    res.status(200).json(results);
  });
};

// obtener un usuario
export const getUser = (req, res) => {
  const idUser = req.params.id;

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
  const { correo } = req.body;

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
  const { correo, token } = req.body;
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
  const {correo, contraseña} = req.body;
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
  const { nombre, correo, contraseña , id_rol_id} = req.body;

  // Validar el nombre de usuario
  if (
    nombre.length < 6 ||
    !/^[a-zA-Z0-9]+$/.test(nombre) ||
    /\s/.test(nombre)
  ) {
    return res.status(400).json({ error: "El nombre de usuario no cumple con los requisitos." });
  }

  const saltRounds = 15;

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
          if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('correo')) {
            return res.status(400).json({ error: "Correo electrónico duplicado" });
          }
          return res.status(500).json({ message: "Error interno del servidor" });
        }

        res.status(201).json({ message: "Usuario creado exitosamente" });
      }
    );
  });
};

// eliminar un usuario
export const deleteUser = (req, res) => {
  const idUsuario = req.params.id;

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
  const idUsuario = req.params.id;
  const { nombre, correo, contraseña, id_rol_id } = req.body;

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
            reject(`Error al actualizar ${fieldName}`);
          }
          resolve(`Campo ${fieldName} actualizado correctamente`);
        });
      }
    });
  };

  if (nombre) {
    updatePromises.push(updateField('nombre', nombre));
  }
  if (correo) {
    updatePromises.push(updateField('correo', correo));
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
    idUser: user.id_user,
    user_email: user.user_email,
    user_name: user.user_name,
    user_type: user.user_type
  };

  const token = jwt.sign(payload, secretKey);

  return token;
}


export const loginUser = (req, res) => {
  const correo = req.body.email;
  const contraseña = req.body.password;

  connection.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo],
    (err, results) => {
      console.log('Resultados de la base de datos:', results);

      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'No se ha encontrado el usuario' });
      }
      const usuario = results[0];

      bcrypt.compare(contraseña, usuario.contraseña, (bcryptErr, isMatch) => {
        console.log('Comparando contraseñas:', isMatch);
        if (bcryptErr) {
          console.error(bcryptErr);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (!isMatch) {
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token de autenticación
        const token = generateAuthToken(usuario);

        // res.status(200).json({ token, usuario });
        res.status(200).json({ token, usuario });
      });
    }
  );
};
