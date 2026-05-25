const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'public', 'images', 'months');

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
      continue;
    }

    // Only compress standard .webp files (ignore if it's already a .min.webp)
    if (file.endsWith('.min.webp') || !file.endsWith('.webp')) {
        continue;
    }

    const minWebpPath = fullPath.replace('.webp', '.min.webp');

    console.log(`Compressing to ultra-low: ${file}...`);

    try {
      await sharp(fullPath)
        .resize({
          width: 600,
          withoutEnlargement: true
        })
        .webp({
          quality: 35, // Very aggressive compression
          effort: 6,
          smartSubsample: true
        })
        .withMetadata(false)
        .toFile(minWebpPath);
        
        console.log(`Success: ${minWebpPath}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

async function main() {
  console.log('Starting ultra compression...');
  await processDirectory(imagesDir);
  console.log('Done!');
}

main();
