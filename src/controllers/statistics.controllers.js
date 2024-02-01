import db from '../db.js'

//* Show the average number of tasks completed so far
const completedTasks = (req, res) => {
    db.query("SELECT * FROM VW_TareasCompletadas",(err,result) =>{
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
    })
}

//* Show the total number of teams working
const teamsWorking = (req, res) => {
    db.query("SELECT * FROM VW_EquiposTrabajando",(err, result) =>{
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
    }) 
}

//* Show projects in progress
const projectsInProgress = (req, res) => {
    db.query("SELECT * FROM VW_ProyectosEnProceso",(err, result) =>{
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
    })
}

//* Show the total of members
const totalMembers = (req, res) => {
    db.query("SELECT * FROM VW_TotalMiembros",(err, result) =>{
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
    })
}

export default{
    completedTasks,
    teamsWorking,
    projectsInProgress,
    totalMembers,
}