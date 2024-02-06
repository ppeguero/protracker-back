import connection from '../routes/db.js'

// RECURSO

export const getResources = (req,res) => {
    connection.query("SELECT * FROM recurso", (err, results) => {
        if (err){
            console.error(err)
            return res.status(500).json({message: "Error interno del servidor"})
        }
        res.status(200).json(results)
    });
};

export const getResourceByProjectId = (req, res) => {
    const projectId = req.query.id_proyecto_id;
    connection.query("SELECT * FROM recurso WHERE id_proyecto_id = ?", [projectId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
        res.status(200).json(results);
    });
};


export const getResource = (req, res) => {
    const id_resource = req.params.id;
    connection.query("SELECT * FROM recurso WHERE id_recurso = ?", [id_resource], (err, results) => {
        if (err){
            console.error(err)
            return res.status(500).json({message: "Error interno del servidor"})
        }
        if (results.length === 0){
            return res.status(404).json({message: "Recurso no encontrado :("})
        }
        res.status(200).json(results[0]);
    })
}

export const createResource = (req, res) => {
    const {nombre, descripcion, tipo, cantidad} = req.body;

    if (!nombre || !descripcion || !tipo || !cantidad ){
        return res.status(400).json({message: "¡Se requieren todos los valores!"})
    }

    connection.query("INSERT INTO recurso (nombre, descripcion, tipo, cantidad) VALUES (?,?,?,?)", 
    [nombre, descripcion, tipo, cantidad],
    (err, results) => {
        if (err){
            console.error(err)
            return res.status(500).json({message: "Error interno del servidor"})
        }
        res.status(201).json({message: "Recurso creado exitosamente"})
    })
}

export const updateResource = (req, res) => {
    const id_resource = req.params.id;
    const {nombre, descripcion, tipo, cantidad} = req.body;

    const setFields = [];

    if (nombre){
        setFields.push(`nombre = '${nombre}'`)
    }
    if (descripcion){
        setFields.push(`descripcion = '${descripcion}'`)
    }
    if (tipo){
        setFields.push(`tipo = '${tipo}'`)
    }
    if (cantidad){
        setFields.push(`cantidad = '${cantidad}'`)
    }

    connection.query(`UPDATE recurso SET ${setFields.join(", ")} WHERE id_recurso = ?`, [id_resource],
    (err, results) => {
        if (err){
            console.error(err)
            return res.status(500).json({message: "Error interno del servidor"})
        }

        return res.status(200).json({message: "Datos actualizados correctamente"})
    })
}

export const deleteResource = (req, res) => {
    const id_resource = req.params.id;

    connection.query("DELETE FROM recurso WHERE id_recurso = ?", [id_resource], (err, results) => {
        if (err){
            console.error(err)
            return res.status(500).json({message: "Error interno del servidor"})
        }
        if (results.affectedRows === 0){
            return res.status(404).json({message: "No se encontraron los datos para eliminar"})
        }
        return res.status(200).json({message: "Los datos se han eliminado correctamente"})
    })
}

// SOLICITUDES DE RECURSO

export const getResourceRequests = (req, res) => {
    connection.query("SELECT sr.*, r.nombre AS nombre_recurso FROM solicitud_recurso sr LEFT JOIN recurso r ON sr.id_recurso_id = r.id_recurso", (err, results) => {
        if (err){
            console.error(err)
            return res.status(500).json({ message: "Error interno del servidor:(" })
        }
        res.status(200).json(results)
    })
}


export const getResourceRequest = (req, res) => {
    const id_request = req.params.id;
    connection.query(
        "SELECT solicitud_recurso.*, recurso.nombre AS nombre_recurso " +
        "FROM solicitud_recurso " +
        "INNER JOIN recurso ON solicitud_recurso.id_recurso_id = recurso.id_recurso " +
        "WHERE solicitud_recurso.id_solicitud_recurso = ?",
        [id_request],
        (err, results) => {
            if (err){
                console.error(err);
                return res.status(500).json({message: "Error interno del servidor"});
            }
            if (results.length === 0){
                return res.status(404).json({message: "No se encontró la solicitud!"});
            }
            res.status(200).json(results[0]);
        }
    );
};


export const getResourceRequestByUser = (req, res) => {
    const id_user = req.query;

    connection.query("SELECT * FROM s")
}

export const createResourceRequest = (req, res)=> {
    const {cantidad, razon_de_solicitud, id_recurso_id, id_proyecto_id, id_miembro_id, fecha_de_inicio, fecha_retorno} = req.body;
    const aprobado = null;

    connection.query("INSERT INTO solicitud_recurso (cantidad, razon_de_solicitud, aprobado, id_recurso_id, id_proyecto_id, id_miembro_id, fecha_de_inicio, fecha_retorno) VALUES (?,?,?,?,?,?,?,?)",
    [cantidad, razon_de_solicitud, aprobado, id_recurso_id, id_proyecto_id, id_miembro_id, fecha_de_inicio, fecha_retorno], (err, results)=>{
        if (err){
            console.error(err)
            return res.status(500).json({message: "Error del servidor"})
        }
        return res.status(201).json({message: "Solicitud creada exitosamente"})
    })
}

export const deleteResourceRequest = (req, res) => {
    const id_request = req.params.id;

    connection.query("DELETE FROM solicitud_recurso WHERE id_solicitud_recurso = ?", [id_request], (err, results)=> {
        if (err){
            console.error(err)
            return res.status(500).json({message: "Error del servidor"})
        }
        if (results.affectedRows === 0){
            return res.status(404).json({message: "No se encontro el dato"})
        }
        return res.status(200).json({message: "Se eliminaron los datos"})
    })
}

export const updateResourceRequest = (req, res) => {
    const id_request = req.params.id;
    const {cantidad, razon_de_solicitud, aprobado} = req.body;

    const setFields = []

    if (cantidad){
        setFields.push(`cantidad = '${cantidad}'`)
    }
    if (razon_de_solicitud){
        setFields.push(`razon_de_solicitud = '${razon_de_solicitud}'`)
    }
    if (aprobado){
        setFields.push(`aprobado = '${aprobado}'`)
    }


    connection.query(`UPDATE solicitud_recurso SET ${setFields.join(", ")} WHERE id_solicitud_recurso = ?`, [id_request], (err, results)=> {
        if (err){
            console.error(err)
            return res.status(500).json({message:"Error interno del servidor"})
        }
        return res.status(200).json({message: "Datos actualizados correctamente"})
    })
}

// cuando se acepte la solicitud de un recurso, se va a eliminar la cantidad del recurso que se solicitó
// por ejemplo , hay 1 recurso de 20 personas en el proyecto, se hace una solicitud de 2 personas
// se acepta la solicitud, y se restan 2 personas del recurso.
export const acceptResourceRequest = (req, res) => {
    const id_request = req.params.id;

    connection.query("SELECT * FROM solicitud_recurso WHERE id_solicitud_recurso = ?", [id_request], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error del servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Solicitud de recurso no encontrada." });
        }

        const request = results[0];
        const quantityRequested = request.cantidad;

        connection.query("SELECT * FROM recurso WHERE id_recurso = ?", [request.id_recurso_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error del servidor al obtener información del recurso" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Recurso asociado a la solicitud no encontrado." });
            }

            const resource = results[0];
            const quantityAvailable = resource.cantidad;

            if (quantityRequested > quantityAvailable) {
                return res.status(400).json({ message: "No hay suficiente cantidad de recurso disponible para aceptar esta solicitud." });
            }

            const quantityLeft = quantityAvailable - quantityRequested;

            connection.query("UPDATE solicitud_recurso SET aprobado = true WHERE id_solicitud_recurso = ?", [id_request], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error del servidor al actualizar el estado de la solicitud de recurso" });
                }

                connection.query("UPDATE recurso SET cantidad = ? WHERE id_recurso = ?", [quantityLeft, request.id_recurso_id], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Error del servidor al actualizar la cantidad de recurso disponible" });
                    }

                    if (quantityLeft === 0) {
                        connection.query("DELETE FROM recurso WHERE id_recurso = ?", [request.id_recurso_id], (err, results) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: "Error del servidor al eliminar el recurso" });
                            }
                        });
                    }

                    res.status(200).json({ message: "Solicitud aceptada y recurso actualizado exitosamente" });
                });
            });
        });
    });
};


// cuando se decline la solicitud de un recurso, se va a actualizar el campo 'aprobado' a false
export const declineResourceRequest = (req, res) => {
    const id_request = req.params.id;

    connection.query("SELECT * FROM solicitud_recurso WHERE id_solicitud_recurso = ?", [id_request], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error del servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Solicitud de recurso no encontrada." });
        }

        const request = results[0];

        connection.query("UPDATE solicitud_recurso SET aprobado = false WHERE id_solicitud_recurso = ?", [id_request], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error del servidor al declinar la solicitud de recurso" });
            }

            res.status(200).json({ message: "Solicitud declinada exitosamente" });
        });
    });
};
