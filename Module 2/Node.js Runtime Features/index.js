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
      console.error('Error reading file:', err.message);
      return;
    }
    // With no encoding specified, data is returned as a Buffer
    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

// ── PART 2: flow the file through a stream to copy it ───────────────────────
function streamFile() {
  const readStream = fs.createReadStream(INPUT);
  const writeStream = fs.createWriteStream(OUTPUT);

  // Pipe readable stream to writable stream to copy in chunks
  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    console.log('stream: finished copying via 64KB chunks (peak memory stays flat)');
  });

  readStream.on('error', (err) => {
    console.error('Read stream error:', err.message);
  });

  writeStream.on('error', (err) => {
    console.error('Write stream error:', err.message);
  });
}

// ── PART 3: explain the difference in your own words ────────────────────────
/**
 * EXPLANATION:
 * When using fs.readFile, the entire file is loaded into RAM all at once as a single buffer,
 * meaning memory consumption scales directly with the file size. This can easily cause the server
 * to crash with a "JavaScript heap out of memory" error when handling large files.
 * 
 * In contrast, streams process data sequentially in small, fixed-size chunks (e.g., 64 KB) and pass
 * them along through the pipeline without storing the whole file in memory. Because only one chunk is held
 * in RAM at any given moment and freed immediately after, peak memory usage remains flat and minimal
 * regardless of how large the file is.
 */

// Run both implementations
readWholeFile();
streamFile();
