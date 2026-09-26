#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import sharpModule from 'sharp';

const sharp = sharpModule.default || sharpModule;
const TARGET_DIR = path.join(process.cwd(), 'public', 'content', 'upload');
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.tiff', '.gif', '.avif', '.bmp'];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function* walk(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) yield* walk(full);
      else yield full;
    }
  } catch (err) {
    return;
  }
}

async function run() {
  const replace = process.argv.includes('--replace');
  const quality = 90; // high quality default

  if (!(await exists(TARGET_DIR))) {
    console.log(`Directory does not exist: ${TARGET_DIR}`);
    return;
  }

  const files = [];
  for await (const f of walk(TARGET_DIR)) {
    const ext = path.extname(f).toLowerCase();
    if (IMAGE_EXTS.includes(ext) && ext !== '.webp') {
      files.push(f);
    }
  }

  if (files.length === 0) {
    console.log('No non-webp images found to convert.');
    return;
  }

  console.log(`Converting ${files.length} images to webp in ${TARGET_DIR}...`);
  let convertedCount = 0;

  for (const file of files) {
    const ext = path.extname(file);
    const out = file.slice(0, -ext.length) + '.webp';
    try {
      await sharp(file).webp({ quality }).toFile(out);
      convertedCount++;
      console.log(`✓ Converted: ${path.basename(file)} -> ${path.basename(out)}`);
      if (replace) {
        await fs.unlink(file);
        console.log(`  Deleted original: ${path.basename(file)}`);
      }
    } catch (err) {
      console.error(`✗ Failed to convert ${path.basename(file)}:`, err.message || err);
    }
  }

  console.log(`✓ Completed. Converted ${convertedCount} / ${files.length} files.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
