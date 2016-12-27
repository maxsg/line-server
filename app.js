// express-specific variables
var express = require('express'),
		app = express(),
    fs = require('fs'),
    cache = require('memory-cache'),
		router = express.Router();

// load backend modules
var preprocessor = require('./preprocessor');
    lines = require('./lines');

// declare data-storing variables 
var lineMap,
    totalBytes,
    maxIndex;

// server config constants 
const baseURL = '/lines',
      lineIndexURL = '/:line_index(\\d+)',
      errLineIndexZero = "Sorry the line index must be at least 1.",
      errLineIndexTooLarge = "Sorry the requested line is beyond the end of the file.",
      errReadingLine = "Sorry something went wrong.",
      errProcessingFile = "Couldn't process file",
      fileName = process.env.TEST_FILE,
      port = process.env.PORT || 3000,
      host = '127.0.0.1';


// set the base url for modular routing 
app.use(baseURL, router);

// handle lineIndex requests
router.get(lineIndexURL, function (req, res) {
  // extract and validate lineIndex request
  var lineIndex = +req.params.line_index;
  handleInvalidLineIndex(lineIndex, res);

  console.log("handling line index request", lineIndex);

  // use cache for line data
  var line = cache.get(lineIndex);
  if (line === null) {
    line = lines.getLine(fileName, lineIndex, lineMap, totalBytes, maxIndex, function(err, line) {
      if (!err) {
        console.log(line);
        cache.put(lineIndex, line);
        res.send(line);
      } else {
        res.status(500).send(errReadingLine);
      }
    })
  } else {
    console.log(line);
    res.send(line);
  }
});


preprocessor.processFile(fileName, function(err, _lineMap, _totalBytes, _maxIndex) {
  if (!err) {
    // store the preprocessor results
    lineMap = _lineMap;
    totalBytes = _totalBytes;
    maxIndex = _maxIndex;
  } else {
    console.log(errProcessingFile);
  }
}, start_server);


// validate that 0 < lineIndex <= maxIndex */
function handleInvalidLineIndex(lineIndex, res) {
  if (lineIndex == 0) {
    res.status(413).send(errLineIndexZero);
  }
  if (lineIndex > maxIndex) {
    res.status(413).send(errLineIndexTooLarge);
  }
}


function start_server() {
  app.listen(port, function () {
    console.log('Server running at http://%s:%s', host, port);
  })
}