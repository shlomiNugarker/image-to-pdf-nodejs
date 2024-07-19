import express, { Express } from 'express'
import { json } from 'body-parser'
import expressSession from 'express-session'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import ocrRoutes from './api/ocr/ocr.routes'
// import {
//   convertImagesInDirectory,
//   convertImageToPdfWithText,
// } from './services/ocr.service'

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

// const corsOptions = {
//   origin: [
//     'http://127.0.0.1:3000',
//     'http://localhost:3000',
//     'https://image-to-pdf-free.vercel.app/',
//   ],
//   methods: ['POST'], // Specify allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
//   credentials: true,
// }
// app.use(cors(corsOptions))

app.use(cors()) // This will allow all origins. You can configure it to allow specific origins if needed.

app.use('/api/ocr', ocrRoutes)

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 3030
http.listen(PORT, () => {
  console.log(`⚡️Server is running on port: ${PORT}`)
})

// // Uncomment these lines to use the conversion functions directly
// const imagePath = path.resolve(__dirname, 'images', 'IMG_0047.PNG')
// const outputPdfPath = path.resolve(__dirname, 'pdfs', 'output.pdf')

// convertImageToPdfWithText(imagePath, outputPdfPath)

// const imagesDirectory = path.resolve(__dirname, 'images')
// convertImagesInDirectory(imagesDirectory)
