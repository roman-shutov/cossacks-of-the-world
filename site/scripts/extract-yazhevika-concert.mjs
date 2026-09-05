// Local, non-generative cleanup of the approved portrait preview.
// Adapted from extract_yazhevika_alpha.py: boundary-connected neutral background
// only, narrow matte feather, edge-colour propagation; interior RGB is unchanged.
import sharp from 'sharp';
const isSerova = process.argv.includes('--serova');
const source = isSerova ? 'G:/OneDrive/Desktop/IMG_3571.PNG' : 'C:/Users/supas/.codex/generated_images/01a05961-869a-77d3-9d9a-bfa100dd360a/exec-02c935c8-f67b-40f5-a48d-810796ead82d.png';
const output = isSerova ? 'public/images/artist-serova-alpha.png' : 'public/images/artist-yazhevika-concert-alpha.png';
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info, n = w * h;
const removed = new Uint8Array(n), queue = new Int32Array(n);
let head = 0, tail = 0;
const neutral = i => {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  // Protect bright warm skin even where it meets the pale checkerboard.
  const warmSkin = isSerova ? r-g >= 18 && r-b >= 25 : r - g >= 4 && r - b >= 8;
  return !warmSkin && Math.min(r, g, b) >= (isSerova ? 190 : 218) && Math.max(r, g, b) - Math.min(r, g, b) <= (isSerova ? 32 : 18);
};
const seed = i => { if (!removed[i] && neutral(i)) { removed[i] = 1; queue[tail++] = i; } };
for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
while (head < tail) {
  const i = queue[head++], x = i % w;
  if (x > 0) seed(i - 1); if (x < w - 1) seed(i + 1);
  if (i >= w) seed(i - w); if (i < n - w) seed(i + w);
}
const matte = Buffer.alloc(n, 255);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const xx = x + dx, yy = y + dy;
    if (xx >= 0 && xx < w && yy >= 0 && yy < h && removed[yy * w + xx]) matte[y * w + x] = 0;
  }
}
const alpha = await sharp(matte, { raw: { width: w, height: h, channels: 1 } }).blur(.5).toColourspace('b-w').raw().toBuffer();
if (alpha.length !== n) throw Error('Expected a single-channel alpha matte');
const rgba = Buffer.alloc(n * 4), seen = new Uint8Array(n);
head = 0; tail = 0;
for (let i = 0; i < n; i++) {
  rgba[i * 4] = data[i * 3]; rgba[i * 4 + 1] = data[i * 3 + 1]; rgba[i * 4 + 2] = data[i * 3 + 2];
  rgba[i * 4 + 3] = alpha[i] < 12 ? 0 : alpha[i];
  if (alpha[i] === 255) { seen[i] = 1; queue[tail++] = i; }
}
while (head < tail) {
  const i = queue[head++], x = i % w;
  const spread = j => {
    if (seen[j] || !rgba[j * 4 + 3]) return;
    seen[j] = 1; queue[tail++] = j;
    rgba[j * 4] = rgba[i * 4]; rgba[j * 4 + 1] = rgba[i * 4 + 1]; rgba[j * 4 + 2] = rgba[i * 4 + 2];
  };
  if (x > 0) spread(i - 1); if (x < w - 1) spread(i + 1);
  if (i >= w) spread(i - w); if (i < n - w) spread(i + w);
}
for (let i = 0; i < n; i++) if (!rgba[i * 4 + 3]) rgba.fill(0, i * 4, i * 4 + 4);
await sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toFile(output);
const stats = await sharp(output).stats();
console.log(JSON.stringify({ output, width: w, height: h, backgroundPixelsRemoved: removed.reduce((a, b) => a + b, 0), alpha: stats.channels[3] }));
// Remove only empty canvas margins so full-body and cropped portraits share a
// predictable bottom baseline; originals remain untouched.
for (const [input, destination] of (isSerova ? [[output, 'public/images/artist-serova-framed.png']] : [
  [output, 'public/images/artist-yazhevika-concert-framed.png'],
  ['public/images/artist-rgd-cutout-v5.png', 'public/images/artist-rgd-framed.png'],
])) {
  const { data: pixels, info: meta } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = meta.width, top = meta.height, right = 0, bottom = 0;
  for (let y = 0; y < meta.height; y++) for (let x = 0; x < meta.width; x++) {
    if (pixels[(y * meta.width + x) * 4 + 3] >= 96) {
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  left = Math.max(0, left - 6); top = Math.max(0, top - 6);
  right = Math.min(meta.width - 1, right + 6); bottom = Math.min(meta.height - 1, bottom + 6);
  await sharp(input).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).png().toFile(destination);
  console.log(JSON.stringify({ destination, left, top, right, bottom }));
}
