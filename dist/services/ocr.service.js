"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertImageToPdfWithText = void 0;
const tesseract_js_1 = require("tesseract.js");
const pdf_lib_1 = require("pdf-lib");
const promises_1 = __importDefault(require("fs/promises"));
function convertImageToPdfWithText(imagePath, outputPdfPath) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initialize Tesseract.js worker
            const worker = yield (0, tesseract_js_1.createWorker)();
            // Set Tesseract.js parameters
            yield worker.setParameters({ tessedit_pageseg_mode: tesseract_js_1.PSM.AUTO });
            // Recognize text from image
            const { data: { text, lines }, } = yield worker.recognize(imagePath);
            yield worker.terminate();
            // Split recognized text into lines
            const lineTexts = text.split('\n');
            // Combine recognized lines and empty strings from lineTexts
            const combinedLines = [];
            let textIndex = 0;
            for (const lineText of lineTexts) {
                if (lineText === '') {
                    combinedLines.push({ text: '', words: [{ font_size: 12 }] }); // Default font size for empty lines
                }
                else {
                    combinedLines.push(lines[textIndex]);
                    textIndex++;
                }
            }
            // Create PDF document
            const pdfDoc = yield pdf_lib_1.PDFDocument.create();
            let page = pdfDoc.addPage();
            // Embed font and configure text properties
            const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
            const margin = 50;
            let yOffset = page.getHeight() - margin;
            // Write text to PDF page with margins
            for (const line of combinedLines) {
                if (line.text === '') {
                    yOffset -= 12; // Space for empty lines, adjust as needed
                    continue;
                }
                const fontSize = ((_a = line.words[0]) === null || _a === void 0 ? void 0 : _a.font_size) / 1.7 || 12; // Default font size if font_size is undefined
                const lineSpacing = 5;
                const textColor = (0, pdf_lib_1.rgb)(0, 0, 0);
                if (yOffset < margin) {
                    // Add new page if the current page is full
                    page = pdfDoc.addPage();
                    yOffset = page.getHeight() - margin;
                }
                page.drawText(line.text.trim(), {
                    x: margin,
                    y: yOffset,
                    size: fontSize,
                    font,
                    color: textColor,
                });
                yOffset -= fontSize + lineSpacing;
            }
            // Save PDF to file
            const pdfBytes = yield pdfDoc.save();
            yield promises_1.default.writeFile(outputPdfPath, pdfBytes);
            console.log(`PDF created at ${outputPdfPath}`);
        }
        catch (error) {
            console.error('Error converting image to PDF:', error);
        }
    });
}
exports.convertImageToPdfWithText = convertImageToPdfWithText;
