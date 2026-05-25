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
      if (['month9', 'month10', 'month11'].includes(file) || directory.includes('month9') || directory.includes('month10') || directory.includes('month11')) {
         await processDirectory(fullPath);
      }
      continue;
    }

    const ext = path.extname(file).toLowerCase();

    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;

    const webpPath =
      fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';

    console.log(`Converting ${file}...`);

    try {
      await sharp(fullPath)
        .rotate()
        .resize({
          width: 800,
          withoutEnlargement: true
        })
        .webp({
          quality: 40,
          effort: 6,
          smartSubsample: true
        })
        .withMetadata(false)
        .toFile(webpPath + '.tmp'); // Write to a temp file first

      // Use try/catch specifically for unlink to handle Windows EPERM
      try {
        if (fs.existsSync(webpPath)) {
            fs.unlinkSync(webpPath);
        }
        fs.renameSync(webpPath + '.tmp', webpPath);
        if (fullPath !== webpPath) {
           fs.unlinkSync(fullPath);
        }
        console.log(`Converted and removed original: ${file}`);
      } catch (unlinkErr) {
        console.error(`Could not remove original or rename ${file} due to file lock, leaving both:`, unlinkErr.message);
        // Fallback rename if original unlink failed
        if (fs.existsSync(webpPath + '.tmp')) {
           fs.renameSync(webpPath + '.tmp', webpPath);
        }
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
      if (fs.existsSync(webpPath + '.tmp')) {
         fs.unlinkSync(webpPath + '.tmp');
      }
    }
  }
}

async function main() {
  console.log('Starting ultra image optimization for 9,10,11...');
  await processDirectory(imagesDir);
  console.log('Optimization complete!');
}

main();
