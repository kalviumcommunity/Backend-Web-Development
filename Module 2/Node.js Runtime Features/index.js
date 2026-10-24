
/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// PART 1: Read the whole file into memory
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log(
      `readFile: loaded ${data.length} bytes into memory`
    );
  });
}

// PART 2: Stream the file and copy it
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  readable.pipe(writable);

  writable.on('finish', () => {
    console.log(
      'stream: finished copying via 64KB chunks (flat memory)'
    );
  });

  readable.on('error', (err) => {
    console.error(err.message);
  });

  writable.on('error', (err) => {
    console.error(err.message);
  });
}

// PART 3: Explanation
// fs.readFile loads the entire file into memory at once, so larger files
// require more memory. Streams process the file in small chunks instead
// of loading everything together, keeping peak memory usage relatively
// stable even when handling very large files.

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };
