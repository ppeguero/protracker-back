import https from 'https';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import taskRoutes from './src/routes/tasks.routes.js';
import userRoutes from './src/routes/users.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de HTTPS
const options = {
  key: fs.readFileSync('C:/Windows/System32/cert.key'),
  cert: fs.readFileSync('C:/Windows/System32/cert.crt')
};

// Middleware
app.use(express.json());

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Middleware CORS
app.use(cors({
  origin: 'https://localhost:5173',
  methods: 'GET, POST, PUT, DELETE, PATCH',
  allowedHeaders: 'Content-Type'
}));

// Rutas
app.use('/api', taskRoutes);
app.use('/api', userRoutes);

// Inicializar servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT} con HTTPS :)`);
});
