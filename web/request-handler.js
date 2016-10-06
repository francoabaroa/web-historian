var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!



exports.handleRequest = function (req, res, basePath) {
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
    fs.readFile(filePath, function(err, data) {
      if (err) {
      } else {
        data = data.toString();
        res.writeHead(statusCode, {'Content-Type': 'text/' + ending, 'Content-Length': data.length});
        res.end(data);
      }
    });
  };

  var onGet = function () {
    if (req.url === '/') {
      contentDelivery('web/public/index.html');
    } else {
      archive.isUrlArchived(req.url, function(exists) {
        if (exists) {
          var filePath = archive.getArchivedPath(req.url, basePath);
          contentDelivery(filePath);
        } else {
          res.writeHead(404);
          res.end();
        }
      }, basePath);
    }
  };


  var deliverPage = function(url) {
    // console.log('deliverPage', url);
    // archive.addUrlToList(url, function() {
    //   console.log('route to loading page');
    //   contentDelivery('web/public/loading.html', 302);
    // }, basePath);
    archive.isUrlInList(url, function(exists) {
      if (!exists) {
        archive.addUrlToList(url, function() {
          contentDelivery('web/public/loading.html', 302);
        }, basePath);
      } else {
        archive.isUrlArchived(url, function(exists) {
          if (exists) {
            var path = archive.getArchivedPath(url, basePath);
            contentDelivery(path);
          }
        }, basePath);

      }
    }, basePath);
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

  // req.on('end', function() {
  //   if (req.method === 'GET') {
  //     onGet();
  //   } 
  //   //res.end(archive.paths.list);
  // }); 
};
