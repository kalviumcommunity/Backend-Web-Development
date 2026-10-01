/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// PART 1: read the whole file into memory
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory`);
  });
}

// PART 2: stream the file and pipe it to a writable stream
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  readable.pipe(writable);

  writable.on('finish', () => {
    console.log('stream: finished copying via chunks (flat memory)');
  });
}

// PART 3: explanation
// readFile loads the entire file into memory at once, so a large file can
// consume a lot of RAM. A stream processes the file in small chunks, so
// memory usage stays relatively flat even when the file is very large.

readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };