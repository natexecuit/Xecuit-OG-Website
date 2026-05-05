const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { createCanvas, loadImage } = require('canvas');

async function getImageDimensions(imagePath) {
  const image = await loadImage(imagePath);
  return { width: image.width, height: image.height };
}

async function createPDF() {
  const slides = [];
  for (let i = 1; i <= 7; i++) {
    const filename = `slide-${String(i).padStart(2, '0')}.png`;
    const filepath = path.join(__dirname, '..', filename);
    if (fs.existsSync(filepath)) {
      slides.push(filepath);
    }
  }

  if (slides.length === 0) {
    console.error('No slide images found!');
    process.exit(1);
  }

  // Get dimensions from first slide
  const dims = await getImageDimensions(slides[0]);
  console.log(`Slide dimensions: ${dims.width}x${dims.height}`);

  const doc = new PDFDocument({
    size: [dims.width, dims.height],
    margin: 0
  });

  const outputPath = path.join(__dirname, '..', 'public', 'documents', 'buyer-profile-deck.pdf');
  doc.pipe(fs.createWriteStream(outputPath));

  // Add each slide as a page
  for (const slidePath of slides) {
    if (slides.indexOf(slidePath) > 0) {
      doc.addPage({ size: [dims.width, dims.height], margin: 0 });
    }
    doc.image(slidePath, 0, 0, { width: dims.width, height: dims.height });
  }

  doc.end();
  console.log(`PDF created successfully: ${outputPath}`);
}

createPDF().catch(console.error);
