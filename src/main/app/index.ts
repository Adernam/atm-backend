import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { clientsRoutes, operationsRoutes } from '../routes'

dotenv.config()
const app = express()

app.use(json())
app.use(cors())

clientsRoutes(app)
operationsRoutes(app)

export { app }
