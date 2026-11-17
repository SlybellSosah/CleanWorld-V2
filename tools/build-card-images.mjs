// Generates responsive 1x/2x AVIF, WebP, and JPEG realistic card images (< 120 KB each) for "What we do" and "Who we work with".
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/cards");
mkdirSync(OUT_DIR, { recursive: true });

const MAX_BYTES = 120 * 1024;

const CARDS = [
  { key: "service-fumigation", src: "content-source/generated/ss_pest_control_1782923213624.png", position: "north" },
  { key: "service-cleaning", src: "content-source/generated/south_sudan_female_maid.png", position: "north" },
  { key: "service-waste-collection", src: "content-source/generated/waste_hero.png", position: "center" },
  { key: "service-landscaping", src: "content-source/generated/completed_landscape_1782922167566.png", position: "center" },
  { key: "service-consultancy", src: "content-source/generated/south_sudan_consultant_1782922951830.png", position: "north" },
  { key: "audience-organisation", src: "content-source/generated/clean_world_south_sudan_1782922329033.png", position: "north" },
  { key: "audience-household", src: "content-source/generated/juba-household-compound.png", position: "center" },
];

const VARIANTS = [
  { suffix: "1x", width: 640, height: 400, ext: "avif", format: "avif", options: { quality: 52, effort: 6 } },
  { suffix: "2x", width: 960, height: 600, ext: "avif", format: "avif", options: { quality: 48, effort: 6 } },
  { suffix: "1x", width: 640, height: 400, ext: "webp", format: "webp", options: { quality: 72, effort: 6 } },
  { suffix: "2x", width: 960, height: 600, ext: "webp", format: "webp", options: { quality: 64, effort: 6 } },
  { suffix: "1x", width: 640, height: 400, ext: "jpg", format: "jpeg", options: { quality: 74, mozjpeg: true } },
  { suffix: "2x", width: 960, height: 600, ext: "jpg", format: "jpeg", options: { quality: 62, mozjpeg: true } },
];

for (const card of CARDS) {
  const srcPath = path.resolve(card.src);
  for (const v of VARIANTS) {
    const file = `${card.key}-${v.suffix}.${v.ext}`;
    const outPath = path.join(OUT_DIR, file);
    await sharp(srcPath)
      .resize(v.width, v.height, { fit: "cover", position: card.position })
      .toFormat(v.format, v.options)
      .toFile(outPath);

    const { size } = statSync(outPath);
    console.log(`${file}: ${(size / 1024).toFixed(1)} KB (${size} bytes)`);
    if (size > MAX_BYTES) {
      throw new Error(`${file} exceeds 120 KB limit (${size} bytes > ${MAX_BYTES} bytes)`);
    }
  }
}

