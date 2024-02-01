import express from 'express'
import * as resourceController from '../controllers/resourceController.js'

const resourceRoutes = express.Router()

// solicitudes de recursos
resourceRoutes.get('/resource/request', resourceController.getResourceRequests)
resourceRoutes.get('/resource/request/:id', resourceController.getResourceRequest)
resourceRoutes.post('/resource/request', resourceController.createResourceRequest)
resourceRoutes.delete('/resource/request/:id', resourceController.deleteResourceRequest)
resourceRoutes.patch('/resource/request/:id', resourceController.updateResourceRequest)
resourceRoutes.post('/resource/accept-request/:id', resourceController.acceptResourceRequest)

resourceRoutes.get('/resource', resourceController.getResources)
resourceRoutes.get('/resource/:id', resourceController.getResource)
resourceRoutes.post('/resource', resourceController.createResource)
resourceRoutes.patch('/resource/:id', resourceController.updateResource)
resourceRoutes.delete('/resource/:id', resourceController.deleteResource)




export default resourceRoutes;