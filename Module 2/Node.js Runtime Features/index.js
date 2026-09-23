const fs = require("fs");
const path = require("path");

const INPUT = path.join(__dirname, "sample-data.txt");
const OUTPUT = path.join(__dirname, "sample-copy.txt");

// PART 1
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log(
      `readFile: loaded ${data.length} bytes into memory at once`
    );
  });
}

// PART 2
function streamFile() {
  const read = fs.createReadStream(INPUT);
  const write = fs.createWriteStream(OUTPUT);

  read.pipe(write);

  write.on("finish", () => {
    console.log(
      "stream: finished copying via 64KB chunks (peak memory stays flat)"
    );
  });
}

// PART 3
/*
  fs.readFile loads the whole file into memory at once, so memory usage
  increases with the size of the file. A stream moves the file in small
  chunks, so it uses much less memory and keeps peak memory nearly flat
  even for very large files.
*/

readWholeFile();
streamFile();
