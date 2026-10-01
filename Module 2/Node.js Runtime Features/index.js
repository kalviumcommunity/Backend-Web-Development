/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 *
 * GOAL
 * Move the SAME file two different ways and feel the difference:
 *   1) Load the whole file into memory with fs.readFile, and log its size.
 *   2) Flow the file through a stream and pipe it to a writable stream (a copy).
 * Then explain, in your own words, why the stream approach is preferable for
 * large files.
 *
 * The starter already imports `fs` and `path` for you and points at a large
 * sample file (`sample-data.txt`) that lives next to this script.
 *
 * Run it with:  npm start
 */

const fs = require('fs');
const path = require('path');

// Absolute, OS-safe path to the sample file (do NOT hand-build paths with '+').
const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// ── PART 1: read the whole file into memory, then log its size ──────────────
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory`);
  });
}

// ── PART 2: stream the file and pipe it to a writable stream ────────────────
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  readable.pipe(writable);

  writable.on('finish', () => {
    console.log('stream: finished copying via 64KB chunks (flat memory)');
  });
}
// ── PART 3: explain the difference ──────────────────────────────────────────
// TODO: In your OWN words, replace this comment with 2 to 3 sentences on WHY
//       the stream approach is preferable for large files. Mention memory:
//       readFile holds the whole file at once; the stream moves it in chunks
//       so peak memory stays flat regardless of file size.
//
// YOUR EXPLANATION:
//
// YOUR EXPLANATION:
// readFile loads the entire file into memory at once, which can use a lot of memory
// when working with large files. A stream processes the file in smaller chunks,
// so the application does not need to keep the entire file in memory at once.

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };
