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

    const webpPath =
      fullPath.substring(0, fullPath.lastIndexOf('.')) + '.webp';

    console.log(`Converting ${file}...`);

    try {
      await sharp(fullPath)
        .rotate()
        .resize({
          width: 1200,
          withoutEnlargement: true
        })
        .webp({
          quality: 60,
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
        fs.unlinkSync(fullPath);
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

async function updateCodebase(directory) {
  if (!fs.existsSync(directory)) return;

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await updateCodebase(fullPath);
      continue;
    }

    const ext = path.extname(file).toLowerCase();

    if (!['.tsx', '.ts', '.js', '.jsx'].includes(ext)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    const updated = content.replace(
      /(["'`][^"'`]+)\.(png|jpg|jpeg)/gi,
      '$1.webp'
    );

    if (updated !== content) {
      fs.writeFileSync(fullPath, updated);
      console.log(`Updated references in ${file}`);
    }
  }
}

async function main() {
  console.log('Starting image optimization...');

  await processDirectory(imagesDir);

  console.log('Updating codebase references...');

  await updateCodebase(path.join(__dirname, 'src'));

  console.log('Optimization complete!');
}

main();
