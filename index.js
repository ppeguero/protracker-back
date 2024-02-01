
// importar dotenv para usar la configuracion de .env
import dotenv from 'dotenv'
dotenv.config()

// importar cors
import cors from 'cors'

// rutas
import resourceRoutes from './src/routes/resourceRoutes.js'

// importar express e inicializarlo con app
import express from 'express'
const app = express()

// permitir la comunicación del frontend(en el port 3000) con el backend
app.use(cors({
	origin: 'https://localhost:5173',
	methods: ['GET, POST, PUT, DELETE, PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors()); 

// usar rutas

app.use(express.json())
app.use('/protracker', resourceRoutes)


app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('Algo se rompió!')
})


const PORT = process.env.PORT // crear el env con PORT = 8080

app.listen(PORT, () => {
	console.log(`Servidor corriendo exitosamente en el puerto ${PORT} :)`)
})