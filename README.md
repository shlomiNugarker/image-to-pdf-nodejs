## Overview

`jpeg_to_pdf` is a powerful tool for converting images (JPEG, PNG, and other formats) into PDF documents with text extracted from the images using OCR (Optical Character Recognition). This project leverages Tesseract.js for text recognition and pdf-lib for PDF generation.

The frontend of thie project is here: https://github.com/shlomiNugarker/image-to-pdf-nextjs

## Features

- **Image to PDF Conversion:** Convert images to high-quality PDFs.
- **OCR Support:** Extract text from images and include it in the generated PDF.
- **File Upload and Download:** Upload images through a web interface and download the resulting PDFs.
- **Clean Up:** Automatically deletes temporary files after processing.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/shlomiNugarker/jpeg-to-pdf-nodejs.git
   cd jpeg_to_pdf
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Application**

   ```bash
   npm run dev
   ```

4. **For production:**

   ```bash
   npm run build
   npm start
   ```

## Usage

### Upload an Image

Send a POST request to `/api/ocr/convert` with a form-data field named `image` containing the image file.

Example using `curl`:

```bash
curl -F "image=@path/to/your/image.jpg" http://localhost:3030/api/ocr/convert --output output.pdf

```

### Receive the PDF

Once the server has processed the image, it will respond with a downloadable PDF file. The PDF will include both the image and the extracted text from the image.

**Response:**

- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="output.pdf"`

You can save the file to your local system using the `--output` flag in `curl` or handle the file programmatically in your application.

**Example using `curl`:**

```bash
curl -F "image=@path/to/your/image.jpg" http://localhost:3030/api/ocr/convert --output output.pdf

```

## API

### POST /api/ocr/convert

Uploads an image and returns a PDF with the extracted text.

**Request:**

- **URL:** `http://localhost:3030/api/ocr/convert`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Body:**
  - **image:** File (JPEG, PNG, etc.)

**Response:**

- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="output.pdf"`

The server will respond with a PDF file containing the image and the extracted text. The file will be available for download.

**Example using `curl`:**

```bash
curl -F "image=@path/to/your/image.jpg" http://localhost:3030/api/ocr/convert --output output.pdf

```

## Contributing

    We welcome contributions to the `jpeg_to_pdf` project! To get started, please follow these steps:

1. **Fork the Repository**

   Click on the "Fork" button at the top right of this repository page to create your own copy of the repository.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/shlomiNugarker/jpeg-to-pdf-nodejs.git
   cd jpeg_to_pdf
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature
   ```

4. **Make Your Changes**

   Make the necessary changes or additions in your local repository.

5. **Commit Your Changes**

   ```bash
   git commit -am 'Add new feature or fix'
   ```

6. **Push to the Branch**

   Push your changes to your forked repository:

   ```bash
   git push origin feature/your-feature
   ```

7. **Create a Pull Request**

   Go to the original repository and create a new Pull Request from your branch. Provide a clear description of the changes and why they are being made.

8. **Discuss and Review**

   Engage in discussions and review feedback on your Pull Request. Make any necessary adjustments based on the feedback.

9. **Merge**

   Once approved, your changes will be merged into the main repository.

Thank you for contributing to the jpeg_to_pdf project! Your contributions help make this project better for everyone.

## Contact

Developed by [Shlomi Nugarker](https://www.linkedin.com/in/shlomi-nugarker-b89777155/).

- [LinkedIn](https://www.linkedin.com/in/shlomi-nugarker-b89777155/)
- [Email](mailto:shlomin1231@gmail.com)
- [Portfolio](https://shlomi-nugarker-portfolio.vercel.app/)
