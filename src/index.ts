import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { RegisterRoutes } from './shared/routes'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HTML to PDF API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      docs: '/api-docs',
      health: '/health'
    }
  })
})

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Register tsoa routes
RegisterRoutes(app)

// Setup the /api-docs route with swagger UI
import { readFileSync } from 'fs'
import { join } from 'path'

// Swagger Setup
const swaggerPath = join(__dirname, 'shared', 'swagger.json')
const swaggerDocument = JSON.parse(readFileSync(swaggerPath, 'utf-8'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
  }
}))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`)
})