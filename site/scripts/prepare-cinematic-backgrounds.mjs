// Export reviewed generated masters for the responsive website. Original files
// are retained. 3840x2160 is an export size, not a claim of native 4K generation.
import sharp from 'sharp';
import fs from 'node:fs/promises';
const [heroSource, nationSource] = process.argv.slice(2);
if (!heroSource || !nationSource) throw Error('Pass the two reviewed source paths');
const manifest = [];
for (const [name, source] of [['hero-cossacks-detailed', heroSource], ['nation-family-detailed', nationSource]]) {
  const meta = await sharp(source).metadata();
  await fs.copyFile(source, `public/images/${name}-master.png`);
  for (const width of [1280, 1920, 3840]) {
    const height = width * 9 / 16;
    const output = `public/images/${name}-${width}.webp`;
    await sharp(source).resize(width, height, { fit:'cover', kernel:'lanczos3' }).webp({quality:94, effort:6}).toFile(output);
    manifest.push({output, width, height, sourceWidth:meta.width, sourceHeight:meta.height, upscaled:width>meta.width});
  }
}
await fs.writeFile('qa-responsive/background-assets.json', JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest));
