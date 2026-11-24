// Alien Field Notes: The Two Day Earth Review
// Entry program: writes one original line — an alien tourist's review of
// planet Earth — to /output/entry.txt (UTF-8, 1-200 characters).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY_TEXT =
  "The dogs run the parks and the humans just carry the bags. Five stars for the dogs, one for the leash laws.";

const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry text must not be empty");
  }
  if (text.length > MAX_CHARS) {
    throw new Error(
      `entry text is ${text.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry text must not be only whitespace");
  }
  // The gate counts characters, but keep the byte size in the same band so a
  // multi-byte surprise can never push the file over the limit unnoticed.
  const byteLength = Buffer.byteLength(text, "utf8");
  if (byteLength > MAX_CHARS) {
    throw new Error(
      `entry text is ${byteLength} UTF-8 bytes, over the ${MAX_CHARS} limit`,
    );
  }
  if (text.endsWith("\n")) {
    throw new Error("entry text must not end with a newline");
  }
}

function main(): void {
  validate(ENTRY_TEXT);
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY_TEXT, "utf8");
  // Guard: read the file back and confirm it holds exactly the entry text,
  // byte for byte — a partial or altered write must fail loudly, not pass
  // silently into grading.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== ENTRY_TEXT) {
    throw new Error(
      `round-trip mismatch: file holds ${written.length} characters, expected ${ENTRY_TEXT.length}`,
    );
  }
  console.log(
    `Wrote ${ENTRY_TEXT.length} characters to ${OUTPUT_PATH}: ${ENTRY_TEXT}`,
  );
}

main();
