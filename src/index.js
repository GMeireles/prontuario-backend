import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './models/index.js'

// Rotas
import authRoutes from './routes/authRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import recordRoutes from './routes/recordRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import anamneseRoutes from './routes/anamneseRoutes.js';
import evolutionRoutes from './routes/evolutionRoutes.js';

// Middlewares globais
import { errorHandler } from './middlewares/errorHandler.js'
import { notFoundHandler } from './middlewares/notFoundHandler.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Rotas principais
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/anamneses', anamneseRoutes);
app.use('/api/evolutions', evolutionRoutes);


// Rotas inexistentes
app.use(notFoundHandler)

// Error handler global
app.use(errorHandler)

const PORT = process.env.PORT || 3000

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})
