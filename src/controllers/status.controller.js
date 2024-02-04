import connection from "../routes/db.js";

export const getEstado = (req, res) => {
    const query = `SELECT * FROM estado`;
  
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los estados.' });
      } else {
        res.status(200).json(results);
      }
    });
  };