import sharp from 'sharp';

async function clean(input, output, cropHeight) {
  let pipeline = sharp(input).ensureAlpha();
  const meta = await pipeline.metadata();
  if (cropHeight) pipeline = pipeline.extract({ left: 0, top: 0, width: meta.width, height: Math.min(cropHeight, meta.height) });
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dominance = g - Math.max(r, b);
    const greenStrength = dominance * 3 + g - (r + b) / 2;
    let alpha = 255;
    if (greenStrength >= 30) alpha = 0;
    else if (greenStrength > 5) alpha = Math.round(255 * (30 - greenStrength) / 25);

    if (alpha < 245) data[i + 1] = Math.min(g, Math.round((r + b) / 2 + 3));
    data[i + 3] = Math.min(data[i + 3], alpha);
  }

  await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(output);
}

await clean('public/images/artist-rgd-cutout.png', 'artist-rgd-clean.png');
await clean('public/images/artist-beloboka-cutout.png', 'artist-beloboka-clean.png');
await clean('public/images/artist-yazhevika-cutout.png', 'artist-yazhevika-clean.png', 1190);
