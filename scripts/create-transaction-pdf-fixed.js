const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { createCanvas, loadImage } = require('canvas');

async function getImageDimensions(imagePath) {
  const image = await loadImage(imagePath);
  return { width: image.width, height: image.height };
}

async function createPDF() {
  const imagePath = path.join(__dirname, '..', 'transaction-process.png');

  if (!fs.existsSync(imagePath)) {
    console.error('Screenshot not found!');
    process.exit(1);
  }

  // Get actual image dimensions
  const dims = await getImageDimensions(imagePath);
  console.log(`Image dimensions: ${dims.width}x${dims.height}`);

  const doc = new PDFDocument({
    size: [dims.width, dims.height],
    margin: 0
  });

  const outputPath = path.join(__dirname, '..', 'public', 'documents', 'transaction-process.pdf');
  doc.pipe(fs.createWriteStream(outputPath));

  doc.image(imagePath, 0, 0, { width: dims.width, height: dims.height });

  doc.end();
  console.log(`PDF created successfully: ${outputPath}`);
}

createPDF().catch(console.error);
