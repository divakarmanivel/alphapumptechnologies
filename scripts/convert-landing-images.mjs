/**
 * Convert PNG/JPEG assets to WebP for smaller static payloads.
 *
 * Usage:
 *   npm run landing:webp
 *     → all PNG/JPEG images under assets/ (recursive)
 *   npm run landing:webp -- assets/landingpage
 *     → images in one folder
 *   npm run landing:webp -- assets/jetpumps/pro-1.png
 *     → single file
 */
import sharp from 'sharp';
import { access, readdir, stat } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const assetsDir = join(projectRoot, 'assets');
const QUALITY = 88;
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg']);

async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function displayPath(absPath) {
  return relative(projectRoot, absPath).replace(/\\/g, '/');
}

function webpDestFor(srcPath) {
  const base = basename(srcPath, extname(srcPath));
  return join(dirname(srcPath), `${base}.webp`);
}

function shouldSkip(fileName) {
  if (fileName.includes(' - Copy')) return true;
  if (fileName.toLowerCase() === 'favicon.jpg') return true;
  return false;
}

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listImages(fullPath)));
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    if (shouldSkip(entry.name)) continue;
    files.push(fullPath);
  }

  return files.sort();
}

/**
 * @param {string[]} inputs
 * @returns {Promise<{ src: string; dest: string; label: string }[]>}
 */
async function collectJobs(inputs) {
  /** @type {{ src: string; dest: string; label: string }[]} */
  const jobs = [];

  for (const input of inputs) {
    const resolved = resolve(projectRoot, input);

    if (!(await pathExists(resolved))) {
      console.warn(`Skip (missing): ${input}`);
      continue;
    }

    const info = await stat(resolved);

    if (info.isDirectory()) {
      const images = await listImages(resolved);
      if (images.length === 0) {
        console.warn(`Skip (no images): ${input}`);
        continue;
      }
      for (const src of images) {
        jobs.push({ src, dest: webpDestFor(src), label: displayPath(src) });
      }
      continue;
    }

    const ext = extname(resolved).toLowerCase();
    if (!IMAGE_EXT.has(ext)) {
      console.warn(`Skip (not PNG/JPEG): ${input}`);
      continue;
    }

    jobs.push({ src: resolved, dest: webpDestFor(resolved), label: displayPath(resolved) });
  }

  return jobs;
}

const cliArgs = process.argv.slice(2);
const inputs = cliArgs.length > 0 ? cliArgs : ['assets'];

const jobs = await collectJobs(inputs);

if (jobs.length === 0) {
  console.log(
    'No images converted.\n' +
      '  Default: npm run landing:webp (scans assets/)\n' +
      '  Custom:  npm run landing:webp -- <file|folder> [...]',
  );
  process.exit(1);
}

let totalBefore = 0;
let totalAfter = 0;

for (const { src, dest, label } of jobs) {
  const before = (await stat(src)).size;
  await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(dest);
  const after = (await stat(dest)).size;
  totalBefore += before;
  totalAfter += after;
  console.log(`${label} → ${displayPath(dest)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`);
}

console.log(
  `Done: ${jobs.length} file(s), ${Math.round(totalBefore / 1024)}KB → ${Math.round(totalAfter / 1024)}KB total`,
);
