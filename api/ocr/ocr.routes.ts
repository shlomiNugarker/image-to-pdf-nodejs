import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { convertImageToPdfWithText } from '../../services/ocr.service'

const router = Router()
const upload = multer({ dest: 'uploads/' }) // Set the destination for uploaded files

router.post('/convert', upload.single('image'), async (req, res) => {
  const file = (req as any).file

  if (!file) {
    return res.status(400).send('No file uploaded.')
  }

  const outputPdfPath = path.join('uploads', `${file.filename}.pdf`)

  try {
    await convertImageToPdfWithText(file.path, outputPdfPath)
    res.download(outputPdfPath, async (err) => {
      if (err) {
        console.error('Error sending the file:', err)
      }
      await fs.unlink(file.path) // Clean up uploaded file
      await fs.unlink(outputPdfPath) // Clean up generated PDF
    })
  } catch (error) {
    res
      .status(500)
      .send(`Error converting image to PDF: ${(error as Error).message}`)
  }
})

export default router
