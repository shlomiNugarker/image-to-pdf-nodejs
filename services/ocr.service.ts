import { createWorker, PSM } from 'tesseract.js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs/promises'

export async function convertImageToPdfWithText(
  imagePath: string,
  outputPdfPath: string
) {
  try {
    // Create Tesseract.js worker
    const worker = await createWorker()

    // Set Tesseract.js parameters
    await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO })

    // Recognize text from image
    const {
      data: { text },
    } = await worker.recognize(imagePath)
    await worker.terminate()

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage()

    // Embed font and configure text properties
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 12
    const lineSpacing = 2
    const textColor = rgb(0, 0, 0)

    // Write text to PDF page with margins
    const margin = 50
    let yOffset = page.getHeight() - margin
    const lines = text.split('\n')
    for (const line of lines) {
      if (yOffset < margin) {
        // Add new page if the current page is full
        page = pdfDoc.addPage()
        yOffset = page.getHeight() - margin
      }
      page.drawText(line.trim(), {
        x: margin,
        y: yOffset,
        size: fontSize,
        font,
        color: textColor,
      })
      yOffset -= fontSize + lineSpacing
    }

    // Save PDF to file
    const pdfBytes = await pdfDoc.save()
    await fs.writeFile(outputPdfPath, pdfBytes)

    console.log(`PDF created at ${outputPdfPath}`)
  } catch (error) {
    console.error('Error converting image to PDF:', error)
  }
}
