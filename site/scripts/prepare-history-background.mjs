import sharp from 'sharp';
import fs from 'node:fs/promises';
const source=process.argv[2];
if(!source) throw Error('Source required');
await fs.copyFile(source,'public/images/history-stanitsa-master.png');
for(const width of [1280,1920,3840]) await sharp(source).resize(width,width*9/16,{fit:'cover'}).webp({quality:94}).toFile(`public/images/history-stanitsa-${width}.webp`);
console.log(await sharp(source).metadata());
