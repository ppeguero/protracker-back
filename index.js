// importar dotenv para usar la configuracion de .env
import dotenv from 'dotenv';
dotenv.config();

// importar express e inicializarlo con app
import express from 'express';
const app = express();

// importar cors
import cors from 'cors';

// permitir la comunicación del frontend(en el port 3000) con el backend
app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, PATCH¿',
    allowedHeaders: 'Content-Type'
}));



// importar rutas
import userRoutes from './src/routes/userRoutes.js';

// configurar el middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// usar las rutas definidas en userRoutes
app.use('/fitzone', userRoutes);

// middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo se rompió!');
});

const PORT = process.env.PORT || 8080; // Se establece un valor predeterminado de 8080 si PORT no está definido en el archivo .env

app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en el puerto ${PORT} :)`);
});
