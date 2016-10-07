var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var Promise = require('bluebird');
// require more modules/folders here!



exports.handleRequest = function (req, res) {
  //check for route and method

  var contentDelivery = function(filePath, statusCode) {


    if (statusCode === undefined) {
      statusCode = 200;
    }
    var ending;
    if (filePath.endsWith('.css')) {
      ending = 'css';
    } else {
      ending = 'html';
    }
    return new Promise(function(resolve, reject) {
      fs.readFile(filePath, function(err, data) {
        if (err) {
          reject(err);
        } else {
          data = data.toString();
          res.writeHead(statusCode, {'Content-Type': 'text/' + ending, 'Content-Length': data.length});
          res.end(data);
          resolve();
        }
      });
    });
  };

  var onGet = function () {
    if (req.url === '/') {
      contentDelivery('web/public/index.html');
    } else {
      archive.isUrlArchived(req.url).then(function(exists) {
        if (exists) {
          var filePath = archive.getArchivedPath(req.url);
          contentDelivery(filePath);
        } else {
          res.writeHead(404);
          res.end();
        }
      });
    }
  };

  var deliverPage = function(url) {
    archive.isUrlInList(url).then(function(exists) {
      if (!exists) {
        archive.addUrlToList(url).then(function() {
          contentDelivery('web/public/loading.html', 302);
        });
      } else {
        archive.isUrlArchived(url).then(function(exists) {
          if (exists) {
            var path = archive.getArchivedPath(url);
            contentDelivery(path);
          }
        });
      }
    });
  };

  var onPost = function() {
    req.on('data', function (chunk) {
      chunk = chunk.toString();
      if (chunk.startsWith('url=')) {
        var url = chunk.split('=')[1].trim();
        deliverPage(url);
      }
    });
  };



  if (req.method === 'GET') {
    onGet();
  } else if (req.method === 'POST') {
    onPost();
  }

};
