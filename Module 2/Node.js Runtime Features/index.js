const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// PART 1: Read the whole file
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory`);
  });
}

// PART 2: Stream the file
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  readable.pipe(writable);

  writable.on('finish', () => {
    console.log('stream: finished copying via chunks (flat memory)');
  });
}

// PART 3: Explanation
// readFile loads the entire file into memory at once, which uses more RAM
// for large files. Streams process the file in small chunks, so they use
// less memory and are better for handling large files.

readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };