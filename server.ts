import express, { Express } from 'express'
import { json } from 'body-parser'
import expressSession from 'express-session'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import ocrRoutes from './api/ocr/ocr.routes'

dotenv.config()

const app: Express = express()
const http = require('http').createServer(app)

const session = expressSession({
  secret: 'secret session',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
})

app.use(session)
app.use(json())
app.use(express.static('public'))

app.use(cors())

app.use('/api/ocr', ocrRoutes)

const PORT = process.env.PORT || 3030
http.listen(PORT, () => {
  console.log(`⚡️Server is running on port: ${PORT}`)
})
