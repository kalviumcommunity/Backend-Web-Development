function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      return console.error(err.message);
    }

    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

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

/*
PART 3

fs.readFile loads the whole file into memory, so the amount of memory used
increases with the file size. A stream moves the file in small chunks, so it
does not need to hold the whole file in memory and peak memory stays flat.
*/

readWholeFile();
streamFile();
