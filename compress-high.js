const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'public', 'images');

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const highWebpPath = fullPath.substring(0, fullPath.lastIndexOf('.')) + '.high.webp';

    console.log(`Compressing to high quality: ${file}...`);

    try {
      await sharp(fullPath)
        .rotate()
        .resize({
          width: 1600, // Very high resolution for mobile/tablet screens
          withoutEnlargement: true
        })
        .webp({
          quality: 80, // High quality, low compression artifacts
          effort: 6,
          smartSubsample: true
        })
        .withMetadata(false)
        .toFile(highWebpPath);
        
        console.log(`Success: ${highWebpPath}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

async function main() {
  console.log('Starting high quality compression...');
  await processDirectory(imagesDir);
  console.log('Done!');
}

main();
