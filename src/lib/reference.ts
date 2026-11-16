// No 0/O, 1/I/L or U, so a code read over the phone is unambiguous.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Builds a reference such as CW-7K4M-2QXD from eight random bytes. */
export function makeReference(bytes: Uint8Array): string {
  if (bytes.length < 8) throw new Error("makeReference needs 8 bytes");
  const chars = Array.from(bytes.slice(0, 8), (b) => ALPHABET[b % ALPHABET.length]);
  return `CW-${chars.slice(0, 4).join("")}-${chars.slice(4).join("")}`;
}
