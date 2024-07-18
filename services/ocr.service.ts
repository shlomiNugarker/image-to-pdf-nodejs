import { createWorker, PSM } from 'tesseract.js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs/promises'

export async function convertImageToPdfWithText(
  imagePath: string,
  outputPdfPath: string
) {
  try {
    // Initialize Tesseract.js worker
    const worker = await createWorker()

    // Set Tesseract.js parameters
    await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO })

    // Recognize text from image
    const {
      data: { text, lines },
    } = await worker.recognize(imagePath)
    await worker.terminate()

    // Split recognized text into lines
    const lineTexts = text.split('\n')

    // Combine recognized lines and empty strings from lineTexts
    const combinedLines = []
    let textIndex = 0

    for (const lineText of lineTexts) {
      if (lineText === '') {
        combinedLines.push({ text: '', words: [{ font_size: 12 }] }) // Default font size for empty lines
      } else {
        combinedLines.push(lines[textIndex])
        textIndex++
      }
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage()

    // Embed font and configure text properties
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const margin = 50
    let yOffset = page.getHeight() - margin

    // Write text to PDF page with margins
    for (const line of combinedLines) {
      if (line.text === '') {
        yOffset -= 12 // Space for empty lines, adjust as needed
        continue
      }

      const fontSize = line.words[0]?.font_size / 1.7 || 12 // Default font size if font_size is undefined
      const lineSpacing = 5
      const textColor = rgb(0, 0, 0)

      if (yOffset < margin) {
        // Add new page if the current page is full
        page = pdfDoc.addPage()
        yOffset = page.getHeight() - margin
      }

      page.drawText(line.text.trim(), {
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
