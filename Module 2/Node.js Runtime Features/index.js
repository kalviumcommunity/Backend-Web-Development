const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "sample-data.txt");
const OUTPUT = path.join(__dirname, "sample-copy.txt");

// PART 1 — Read the whole file into memory
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

// PART 2 — Stream the file in chunks
function streamFile() {
  const read = fs.createReadStream(INPUT);
  const write = fs.createWriteStream(OUTPUT);

  read.pipe(write);

  write.on("finish", () => {
    console.log(
      "stream: finished copying via 64KB chunks (peak memory stays flat)"
    );
  });

  read.on("error", (err) => {
    console.error(err.message);
  });

  write.on("error", (err) => {
    console.error(err.message);
  });
}

// PART 3 — Explanation
/*
fs.readFile loads the entire file into memory at once, so the memory used
increases with the size of the file. A stream moves the file in small chunks,
so it does not need to hold the whole file in memory and peak memory stays
almost flat even when the file is very large.
*/

readWholeFile();
streamFile();