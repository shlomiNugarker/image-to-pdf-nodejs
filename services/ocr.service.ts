import { createWorker, PSM } from 'tesseract.js'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'

export async function convertImageToPdfWithText(
  imagePath: string,
  outputPdfPath: string
) {
  const worker = await createWorker()

  await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO })

  const {
    data: { text },
  } = await worker.recognize(imagePath)
  await worker.terminate()

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontSize = 12
  const lines = text.split('\n')
  let yOffset = page.getHeight() - fontSize

  for (const line of lines) {
    page.drawText(line, {
      x: 50,
      y: yOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    })
    yOffset -= fontSize + 2
  }

  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(outputPdfPath, pdfBytes)

  console.log(`PDF created at ${outputPdfPath}`)
}
