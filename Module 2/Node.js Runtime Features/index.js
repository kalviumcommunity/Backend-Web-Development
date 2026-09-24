/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 */

const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "sample-data.txt");
const OUTPUT = path.join(__dirname, "sample-copy.txt");

// PART 1: Read the whole file into memory
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error("Error reading file:", err.message);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

// PART 2: Stream the file and copy it
function streamFile() {
  const read = fs.createReadStream(INPUT);
  const write = fs.createWriteStream(OUTPUT);

  read.pipe(write);

  write.on("finish", () => {
    console.log(
      "stream: finished copying via 64KB chunks (peak memory stays flat)",
    );
  });

  read.on("error", (err) => {
    console.error("Error reading stream:", err.message);
  });

  write.on("error", (err) => {
    console.error("Error writing stream:", err.message);
  });
}

// PART 3: Explanation
/*
fs.readFile loads the whole file into memory at once, so memory usage
increases as the file size increases. A stream moves the file in small
chunks, so peak memory usage stays low even when the file is very large.
*/

// Run both approaches
readWholeFile();
streamFile();

module.exports = {
  readWholeFile,
  streamFile,
  INPUT,
  OUTPUT,
};
