// Generates responsive 1x/2x AVIF, WebP, and JPEG hero background assets under 120 KB each.
import { statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.resolve("content-source/generated/hero-juba-skyline.png");
const OUT_DIR = path.resolve("public");
const MAX_BYTES = 120 * 1024;

const TARGETS = [
  { file: "hero-juba-1x.avif", width: 1280, height: 720, format: "avif", options: { quality: 50, effort: 6 } },
  { file: "hero-juba-2x.avif", width: 1920, height: 1080, format: "avif", options: { quality: 46, effort: 6 } },
  { file: "hero-juba-1x.webp", width: 1280, height: 720, format: "webp", options: { quality: 72, effort: 6 } },
  { file: "hero-juba-2x.webp", width: 1920, height: 1080, format: "webp", options: { quality: 60, effort: 6 } },
  { file: "hero-juba-1x.jpg", width: 1280, height: 720, format: "jpeg", options: { quality: 74, mozjpeg: true } },
  { file: "hero-juba-2x.jpg", width: 1920, height: 1080, format: "jpeg", options: { quality: 48, mozjpeg: true } },
];

for (const target of TARGETS) {
  const outPath = path.join(OUT_DIR, target.file);
  await sharp(SOURCE)
    .resize(target.width, target.height, { fit: "cover", position: "center" })
    .toFormat(target.format, target.options)
    .toFile(outPath);

  const { size } = statSync(outPath);
  const kb = (size / 1024).toFixed(1);
  console.log(`${target.file}: ${kb} KB (${size} bytes)`);
  if (size > MAX_BYTES) {
    throw new Error(`${target.file} exceeds 120 KB limit (${size} bytes > ${MAX_BYTES} bytes)`);
  }
}
