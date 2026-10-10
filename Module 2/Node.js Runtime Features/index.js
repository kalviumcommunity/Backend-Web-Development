
/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// PART 1: Read the whole file into memory, then log its size
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory`);
  });
}

// PART 2: Stream the file and pipe it to a writable stream
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  writable.on('finish', () => {
    console.log(
      'stream: finished copying via 64KB chunks (flat memory)'
    );
  });

  readable.on('error', (err) => {
    console.error(err);
  });

  writable.on('error', (err) => {
    console.error(err);
  });

  readable.pipe(writable);
}

// PART 3: Explain the difference
/*
fs.readFile loads the entire file into memory at once, so larger files
require more memory. Streams read and write the file in smaller chunks,
which keeps peak memory usage relatively flat even for large files.
*/

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };