var fs = require('fs');

/** getLine() uses a Readable Stream to 
 * read a range of bytes from a file 
 * corresponding to a line number.
 * 
 * @param {String} filename: file to read from
 * @param {Number} lineNumber: line number to retrieve
 * @Param {Object} lineMap: table to perform byteOffset
 *                lookup on
 * @Param {Number} totalBytes: total bytes in file
 * @Param {Number} maxIndex: maximum allowable line number
 * @Param {Callback} callback: function to call once finished.
 *                Has signature function(error, fileData) where
 *                fileData is a string containing the line
 */
function getLine(fileName, lineNumber, lineMap, totalBytes, maxIndex, callback) {
    console.log("getting line", +lineNumber);
    var bytesStart = lineMap[+lineNumber];
    // need to subtract one to get to last byte of the line
    var bytesEnd = lineMap[+lineNumber + 1] - 1; 

    // if it's the last line, read through the final byte
    if (lineNumber == maxIndex) {
      bytesEnd = totalBytes;
    } 
    
    console.log("reading bytes " + bytesStart + " through " + bytesEnd + " inclusive");
    
    // start: the byteOffset in the file to start reading at
    // end: the inclusive byteOffset to end reading at
    var stream = fs.createReadStream(fileName, {
      flags: 'r',
      encoding: 'ascii',
      fd: null,
      mode: 0444,
      bufferSize: 64 * 1024,
      start: bytesStart,
      end: bytesEnd
    });

    // read the byte range
    var fileData = '';
    stream.on('data', function(data){
      fileData += data;
    });

    stream.on('error', function(){
      callback('Error', null);
    });

    // done reading the bytes
    stream.on('end', function(){
      callback(null, fileData);
    });
}

exports.getLine = getLine;


