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
const fs_1 = __importDefault(require("fs"));
function convertImageToPdfWithText(imagePath, outputPdfPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const worker = yield (0, tesseract_js_1.createWorker)();
        yield worker.setParameters({ tessedit_pageseg_mode: tesseract_js_1.PSM.AUTO });
        const { data: { text }, } = yield worker.recognize(imagePath);
        yield worker.terminate();
        const pdfDoc = yield pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage();
        const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const fontSize = 12;
        const lines = text.split('\n');
        let yOffset = page.getHeight() - fontSize;
        for (const line of lines) {
            page.drawText(line, {
                x: 50,
                y: yOffset,
                size: fontSize,
                font,
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
            });
            yOffset -= fontSize + 2;
        }
        const pdfBytes = yield pdfDoc.save();
        fs_1.default.writeFileSync(outputPdfPath, pdfBytes);
        console.log(`PDF created at ${outputPdfPath}`);
    });
}
exports.convertImageToPdfWithText = convertImageToPdfWithText;
