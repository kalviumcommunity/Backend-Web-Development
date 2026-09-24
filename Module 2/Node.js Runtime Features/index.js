const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// PART 1: readWholeFile — load entire file into memory
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) return console.error(err.message);
    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

// PART 2: streamFile — copy file chunk by chunk
function streamFile() {
  const read = fs.createReadStream(INPUT);
  const write = fs.createWriteStream(OUTPUT);

  read.pipe(write);

  write.on('finish', () => {
    console.log('stream: finished copying via 64KB chunks (peak memory stays flat)');
  });
}

// Run both
readWholeFile();
streamFile();

/**
 * PART 3: Explanation
 * fs.readFile loads the entire file into memory, so memory usage grows with file size.
 * Streams move the file in small chunks, so memory stays flat no matter how large the file is.
 * This makes streams the safer, scalable choice for big uploads or downloads.
 */
