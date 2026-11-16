// Generates favicon.png, multi-resolution favicon.ico (16x16 & 32x32), and 180x180 apple-touch-icon.png from public/favicon.svg.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public");
const SVG_PATH = path.join(OUT_DIR, "favicon.svg");
const svgBuffer = readFileSync(SVG_PATH);

const PNG_OPTS = { compressionLevel: 9 };

const png64 = await sharp(svgBuffer, { density: 384 })
  .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png(PNG_OPTS)
  .toBuffer();
writeFileSync(path.join(OUT_DIR, "favicon.png"), png64);

const png32 = await sharp(svgBuffer, { density: 384 })
  .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png(PNG_OPTS)
  .toBuffer();

const png16 = await sharp(svgBuffer, { density: 384 })
  .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png(PNG_OPTS)
  .toBuffer();

// Multi-image ICO container wrapping raw PNG images (16x16 + 32x32).
function encodeIco(entries) {
  const count = entries.length;
  const headerSize = 6 + count * 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4);

  let offset = headerSize;
  const chunks = [header];
  for (let i = 0; i < count; i++) {
    const { size, data } = entries[i];
    const base = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, base + 0); // width
    header.writeUInt8(size >= 256 ? 0 : size, base + 1); // height
    header.writeUInt8(0, base + 2); // palette count
    header.writeUInt8(0, base + 3); // reserved
    header.writeUInt16LE(1, base + 4); // color planes
    header.writeUInt16LE(32, base + 6); // bits per pixel
    header.writeUInt32LE(data.length, base + 8); // image byte size
    header.writeUInt32LE(offset, base + 12); // image offset
    offset += data.length;
    chunks.push(data);
  }
  return Buffer.concat(chunks);
}

const icoBuffer = encodeIco([
  { size: 16, data: png16 },
  { size: 32, data: png32 },
]);
writeFileSync(path.join(OUT_DIR, "favicon.ico"), icoBuffer);

// 180x180 opaque #f8fafc canvas with 136x136 centered emblem for iOS home screen.
const touchMark = await sharp(svgBuffer, { density: 384 })
  .resize(136, 136, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png(PNG_OPTS)
  .toBuffer();

const appleTouch = await sharp({
  create: {
    width: 180,
    height: 180,
    channels: 4,
    background: "#f8fafc",
  },
})
  .composite([{ input: touchMark, gravity: "center" }])
  .png(PNG_OPTS)
  .toBuffer();
writeFileSync(path.join(OUT_DIR, "apple-touch-icon.png"), appleTouch);

console.log(`favicon.png: ${png64.length} bytes`);
console.log(`favicon.ico: ${icoBuffer.length} bytes (16x16 + 32x32)`);
console.log(`apple-touch-icon.png: ${appleTouch.length} bytes`);

