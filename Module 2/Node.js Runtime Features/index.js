const fs = require("fs");
const path = require("path");

// Define safe portable paths using path.join and __dirname
const INPUT = path.join(__dirname, "sample-data.txt");
const OUTPUT = path.join(__dirname, "sample-copy.txt");

// 1. readWholeFile — Load the entire file into memory using fs.readFile
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error("Error reading file:", err.message);
      return;
    }
    // data is a Buffer; data.length gives the exact size in bytes
    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

// 2. streamFile — Flow the file in chunks using readable, writable streams and .pipe()
function streamFile() {
  const readStream = fs.createReadStream(INPUT);
  const writeStream = fs.createWriteStream(OUTPUT);

  // Pipe chunks automatically from source to destination
  readStream.pipe(writeStream);

  // Log on the writable's finish event once copying is complete
  writeStream.on("finish", () => {
    console.log("stream: finished copying via 64KB chunks (peak memory stays flat)");
  });

  writeStream.on("error", (err) => {
    console.error("Error writing file:", err.message);
  });
}

// Execute the functions
readWholeFile();
streamFile();

/*
 * ==========================================
 * PART 3: Explanation
 * ==========================================
 * fs.readFile loads the entire file into RAM all at once, meaning memory consumption equals the file size and can easily crash a server under heavy traffic or with large files. 
 * In contrast, streams process data piece-by-piece in small chunks via piping, ensuring peak memory stays flat and predictable no matter how large the file grows.
 */