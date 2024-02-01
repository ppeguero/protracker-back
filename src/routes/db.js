import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.SQLHOST || !process.env.SQLUSER || !process.env.SQLDATABASE) {
    throw new Error("Te hace falta una o varias variables de entorno requeridas para la conexión de la base de datos.");
}

const connection = mysql.createConnection({
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    database: process.env.SQLDATABASE,
    port: process.env.SQLPORT
})

connection.connect((err) => {
    if (err) {
        console.error('Hubo un error conectando a la base de datos', err);
        throw err;
    }
    console.log('Conectado a la base de datos.');
});


export default connection;