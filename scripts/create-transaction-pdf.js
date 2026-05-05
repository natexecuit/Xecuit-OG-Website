const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

async function createPDF() {
  const imagePath = path.join(__dirname, '..', 'transaction-process.png');

  if (!fs.existsSync(imagePath)) {
    console.error('Screenshot not found!');
    process.exit(1);
  }

  const doc = new PDFDocument({
    size: [1200, 1700], // Match document dimensions
    margin: 0
  });

  const outputPath = path.join(__dirname, '..', 'public', 'documents', 'transaction-process.pdf');
  doc.pipe(fs.createWriteStream(outputPath));

  doc.image(imagePath, 0, 0, { width: 1200, height: 1700 });

  doc.end();
  console.log(`PDF created successfully: ${outputPath}`);
}

createPDF().catch(console.error);
