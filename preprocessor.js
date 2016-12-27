var fs = require('fs')

/**
 * processFile() iterates over the bytes
 * of a file to create a table that
 * maps each line number to the start 
 * of that line's byte offset.
 * 
 * @param {String} filename
 * @param {Callback} resultsCallback: the
 *        function to pass results to. Has
 *        signature -> function(error, lineMap, totalBytes, maxIndex)
 *        where lineMap is the table associating
 *        line numbers to byte offsets, totalBytes is
 *        the total number of bytes in the file, and 
 *        maxIndex is the maximum line number.
 * @param {Callback} serverCallback: the 
 *        function to start the server
 */
function processFile(filename, resultsCallback, serverCallback) {
  console.log("indexing file...");

  var stream = fs.createReadStream(filename, {
      flags: 'r',
      encoding: 'ascii',
      fd: null,
      bufferSize: 64 * 1024
    });

    // this will hold the table for {lineId: byteOffset}
    var lineMap = {};
    // seed the first entry -> first line at 0 byteOffset
    lineMap[1] = 0;  
    // which line we are on
    var lineId = 1;
    var byteOffset = 0;
    var totalBytes = 0;

    stream.on('data', function(chunk){
      totalBytes += chunk.length;

      // iterate through bytes, looking for newlines
      for (var b of chunk) { 
        if (b === "\n") {
          lineMap[lineId + 1] = byteOffset;
          lineId += 1;
        }
        byteOffset += Buffer.byteLength(b);
      }
    });

    stream.on('error', function(){
      console.log("error reading file");
    });

    stream.on('end', function(){
      // delete the last id because it is over the maxIndex
      delete lineMap[lineId]; 
      // lineId was incremented one too many times
      var maxIndex = lineId - 1;
      console.log("indexed", maxIndex, "lines");
      resultsCallback(null, lineMap, totalBytes, maxIndex);
      serverCallback();
    });
}


exports.processFile = processFile;
