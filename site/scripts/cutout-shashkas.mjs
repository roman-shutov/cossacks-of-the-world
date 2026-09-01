import sharp from 'sharp';

const input = 'C:/Users/supas/.codex/generated_images/01a05961-869a-77d3-9d9a-bfa100dd360a/exec-c596619c-8051-4fc0-b72f-de5a5bcfbb57.png';
const output = 'shashkas-reference-clean.png';
const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const seen = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let head = 0, tail = 0;

const isBackground = (index) => {
  const offset = index * 3;
  const r = data[offset], g = data[offset + 1], b = data[offset + 2];
  return Math.min(r, g, b) > 190 && Math.max(r, g, b) - Math.min(r, g, b) < 32;
};
const add = (index) => {
  if (index < 0 || index >= width * height || seen[index] || !isBackground(index)) return;
  seen[index] = 1; queue[tail++] = index;
};
for (let x = 0; x < width; x++) { add(x); add((height - 1) * width + x); }
for (let y = 0; y < height; y++) { add(y * width); add(y * width + width - 1); }
while (head < tail) {
  const index = queue[head++], x = index % width;
  if (x > 0) add(index - 1);
  if (x + 1 < width) add(index + 1);
  add(index - width); add(index + width);
  if (x > 0) { add(index - width - 1); add(index + width - 1); }
  if (x + 1 < width) { add(index - width + 1); add(index + width + 1); }
}

const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  rgba[i * 4] = data[i * 3]; rgba[i * 4 + 1] = data[i * 3 + 1]; rgba[i * 4 + 2] = data[i * 3 + 2];
  rgba[i * 4 + 3] = seen[i] ? 0 : 255;
}
await sharp(rgba, { raw: { width, height, channels: 4 } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 18, bottom: 18, left: 18, right: 18, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(output);
console.log(output);
