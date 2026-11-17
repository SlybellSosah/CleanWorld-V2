// No 0/O, 1/I/L or U, so a code read over the phone is unambiguous.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
const UNBIASED_LIMIT = 240; // 30 * 8

/** Builds a reference such as CW-7K4M-2QXD from random bytes using rejection sampling when extra bytes are supplied. */
export function makeReference(bytes: Uint8Array): string {
  if (bytes.length < 8) throw new Error("makeReference needs at least 8 bytes");
  const chars: string[] = [];
  for (let i = 0; i < bytes.length && chars.length < 8; i++) {
    if (bytes[i] < UNBIASED_LIMIT) chars.push(ALPHABET[bytes[i] % ALPHABET.length]);
  }
  for (let i = 0; chars.length < 8; i++) {
    chars.push(ALPHABET[bytes[i % bytes.length] % ALPHABET.length]);
  }
  return `CW-${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`;
}
