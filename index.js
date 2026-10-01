const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "sample-data.txt");
const OUTPUT = path.join(__dirname, "sample-copy.txt");


function streamFile() {
  const readable = fs.createReadStream(INPUT, { highWaterMark: 64 * 1024 });
  const writable = fs.createWriteStream(OUTPUT);

  readable.pipe(writable);
  writable.on("finish", () => {
    console.log("stream: finished copying via 64KB chunks (peak memory stays flat)");
  });

  readable.on("error", (error) => {
    console.error(`stream: ${error.message}`);
  });
  writable.on("error", (error) => {
    console.error(`stream: ${error.message}`);
  });
}

// PART 3: fs.readFile keeps the whole file in memory, so memory usage grows with the file size.
// A stream moves the file in small chunks, keeping peak memory nearly flat even for very large files.
readWholeFile();
streamFile();
