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
  fs.readFile(INPUT, function (err, data) {
    if (err) {
      console.error('readFile error:', err);
      return;
    }
    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

// ── PART 2: stream the file and pipe it to a writable stream ────────────────
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);
  readable.pipe(writable);
  writable.on('finish', function () {
    console.log('stream: finished copying via 64KB chunks (peak memory stays flat)');
  });
}

// ── PART 3: explain the difference ──────────────────────────────────────────
// When you use fs.readFile, Node.js loads the entire file into a single Buffer
// in RAM before your callback even runs, so peak memory usage equals the full
// file size. Streams, on the other hand, read the file in small chunks (e.g.
// 64 KB at a time) and immediately pass each chunk to the writable side, so
// only a tiny slice of data lives in memory at any moment. This means that no
// matter how large the file is, the stream approach keeps peak memory usage
// low and flat, making it far more suitable for large files in production.
//

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };
