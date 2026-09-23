const fs = require('fs');
const path = require('path');

// Absolute, OS-safe path to the sample file
const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// ── PART 1 ──────────────────────────────────────────────
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory`);
  });
}

// ── PART 2 ──────────────────────────────────────────────
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  readable.pipe(writable);

  writable.on('finish', () => {
    console.log('stream: finished copying via chunks (flat memory)');
  });
}

// ── PART 3 ──────────────────────────────────────────────
// fs.readFile loads the entire file into memory, so memory usage grows with
// the file size. A stream moves the file in small chunks, so peak memory stays
// much lower and does not grow with the file size.

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };