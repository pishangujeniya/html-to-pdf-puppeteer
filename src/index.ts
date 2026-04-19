import express, { Router } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import { join } from 'path'
import { RegisterRoutes } from './shared/routes'

const app = express()
const PORT = process.env.PORT || 3001

// Normalize BASE_PATH: leading slash, no trailing slash, empty string means root.
// Examples: '/myapp' -> '/myapp', '/' -> '', '' -> ''
const rawBase = process.env.BASE_PATH || '/'
const BASE_PATH = rawBase === '/' ? '' : '/' + rawBase.replace(/^\/|\/$/g, '')

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'HTML to PDF API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      docs: `${BASE_PATH}/api-docs`,
      health: `${BASE_PATH}/health`
    }
  })
})

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Register tsoa routes
RegisterRoutes(router)

// Swagger — inject BASE_PATH as the server URL so "Try it out" hits the right prefix
const swaggerPath = join(__dirname, 'shared', 'swagger.json')
const swaggerDocument = JSON.parse(readFileSync(swaggerPath, 'utf-8'))
swaggerDocument.servers = [{ url: BASE_PATH || '/' }]

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
  }
}))

app.use(BASE_PATH || '/', router)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Base path: ${BASE_PATH || '/'}`)
  console.log(`Swagger docs available at http://localhost:${PORT}${BASE_PATH}/api-docs`)
})