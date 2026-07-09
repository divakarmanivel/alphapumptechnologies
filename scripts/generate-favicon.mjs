/**
 * Regenerate favicon assets from assets/favicon.jpg
 * Run: npm run generate:favicon
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const outDir = projectRoot;
const src = join(projectRoot, 'assets', 'favicon.png');

const contain = { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } };

const p16 = join(outDir, 'favicon-16x16.png');
const p32 = join(outDir, 'favicon-32x32.png');

await sharp(src).resize(16, 16, contain).png().toFile(p16);
await sharp(src).resize(32, 32, contain).png().toFile(p32);

const tmp = await mkdtemp(join(tmpdir(), 'apt-favicon-'));
const p48 = join(tmp, 'favicon-48x48.png');
await sharp(src).resize(48, 48, contain).png().toFile(p48);

try {
  const ico = await pngToIco([p16, p32, p48]);
  await writeFile(join(outDir, 'favicon.ico'), ico);
} finally {
  await rm(tmp, { recursive: true, force: true });
}

await sharp(src)
  .resize(180, 180, contain)
  .png()
  .toFile(join(outDir, 'apple-touch-icon.png'));

await sharp(src)
  .resize(192, 192, contain)
  .png()
  .toFile(join(outDir, 'android-chrome-192x192.png'));

await sharp(src)
  .resize(512, 512, contain)
  .png()
  .toFile(join(outDir, 'android-chrome-512x512.png'));

const manifest = {
  name: 'Alpha Pump Technologies',
  short_name: 'FINE ALPHA',
  icons: [
    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
  theme_color: '#0F172A',
  background_color: '#ffffff',
  display: 'standalone',
};

await writeFile(join(outDir, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  'Wrote favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest',
);
