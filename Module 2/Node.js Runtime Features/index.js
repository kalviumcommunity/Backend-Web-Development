/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 *
 * GOAL
 * Move the SAME file two different ways and feel the difference:
 *   1) Load the whole file into memory with fs.readFile, and log its size.
 *   2) Flow the file through a stream and pipe it to a writable stream (a copy).
 * Then explain, in your own words, why the stream approach is preferable for
 * large files.
 *
 * Run it with: npm start
 */

const fs = require('fs');
const path = require('path');

// Absolute, OS-safe paths
const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// ── PART 1: Read the whole file into memory ──────────────────────────────────
function readWholeFile() {

    fs.readFile(INPUT, (error, data) => {

        if (error) {
            console.log(error);
            return;
        }

        console.log(`readFile: loaded ${data.length} bytes into memory`);

    });

}

// ── PART 2: Stream the file and copy it ──────────────────────────────────────
function streamFile() {

    const readable = fs.createReadStream(INPUT);

    const writable = fs.createWriteStream(OUTPUT);

    readable.pipe(writable);

    writable.on('finish', () => {

        console.log("stream: finished copying via 64KB chunks (flat memory)");

    });

}

// ── PART 3: Explanation ──────────────────────────────────────────────────────

// Streams are preferable for large files because they process data in small chunks instead of loading the entire file into memory at once. The readFile() method loads the complete file into RAM, which can consume a large amount of memory for big files. Streams keep memory usage low and efficient by reading and writing the file chunk by chunk.

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };