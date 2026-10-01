/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// ── PART 1: read the whole file into memory ─────────────────────────────────
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
    console.log('stream: finished copying via chunks (flat memory)');
  });
}

// ── PART 3: explanation ─────────────────────────────────────────────────────
// readFile loads the entire file into memory at once, so a large file can
// consume a lot of RAM. Streams move the file in small chunks, so only a
// small amount of data is kept in memory at a time, making streams better
// for large files.

readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };