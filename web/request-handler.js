var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //check for route and method

  var contentDelivery = function(filePath) {
    var ending;
    if (filePath.endsWith('.css')) {
      ending = 'css';
    } else {
      ending = 'html';
    }
    fs.readFile(filePath, function(err, data) {
      data = data.toString();
      res.writeHead(200, {'Content-Type': 'text/' + ending, 'Content-Length': data.length});
      res.end(data);
    });
  };

  var onGet = function () {
    if (req.url === '/') {
      contentDelivery('web/public/index.html');
    }
    console.log('URL:', req.url);
  };

  if (req.method === 'GET') {
    onGet();
  } 

  // req.on('end', function() {
  //   if (req.method === 'GET') {
  //     onGet();
  //   } 
  //   //res.end(archive.paths.list);
  // }); 
};
