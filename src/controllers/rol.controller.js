import connection from "../routes/db.js";

export const getRoles = (req, res) => {
    const query = `SELECT * FROM rol`;
  
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener roles.' });
      } else {
        res.status(200).json(results);
      }
    });
  };