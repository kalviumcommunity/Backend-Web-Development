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

  writable.on("finish", () => {
    console.log("stream: finished copying via 64KB chunks (flat memory)");
  });
}

// ── PART 3: explain the difference ──────────────────────────────────────────

// YOUR EXPLANATION:
// fs.readFile loads the entire file into memory at once, so memory usage grows
// with the size of the file. A stream moves the file in small chunks, so peak
// memory stays flat and it is better for handling large files.

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };