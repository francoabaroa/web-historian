var path = require('path');
var fs = require('fs');

var workerPath = path.join(__dirname, 'workers/htmlfetcher');
var workers = require(workerPath);


module.exports = function() {
  fs.appendFile('download.log', '\nCron run');
  workers.htmlFetcher('archives');
};
