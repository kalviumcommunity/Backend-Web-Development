
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
 * Run it with: npm start
 */

const fs = require('fs');
const path = require('path');

// Absolute, OS-safe paths
const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// ── PART 1: read the whole file into memory, then log its size ──────────────
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error('readFile error:', err);
      return;
    }

    // data is a Buffer because no encoding was specified.
    console.log(
      `readFile: loaded ${data.length} bytes into memory at once`
    );
  });
}

// ── PART 2: stream the file and pipe it to a writable stream ────────────────
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  writable.on('finish', () => {
    console.log(
      'stream: finished copying via chunks (peak memory stays flat)'
    );
  });

  readable.on('error', (err) => {
    console.error('Read stream error:', err);
  });

  writable.on('error', (err) => {
    console.error('Write stream error:', err);
  });

  readable.pipe(writable);
}

// ── PART 3: explain the difference ──────────────────────────────────────────
/*
fs.readFile loads the entire file into memory at once, so the memory required
grows with the file size. A stream reads and writes the file in smaller chunks
instead, keeping peak memory usage relatively flat even when the file is large.
*/

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };
