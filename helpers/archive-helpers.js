var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

//var basePath = 'test/testdata';
var basePath = 'archives';

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

var getSitesPath = function () {
  return basePath + '/sites.txt';
};

exports.readListOfUrls = function() {
  var urls;
  var ourPath = getSitesPath();
  return new Promise(function (resolve, reject) {
    fs.readFile(ourPath, function(err, data) {
      data = data.toString();
      if (err) {
        reject(err);
      } else {
        urls = data.split('\n').filter(function(val) {
          return (val.length > 0);
        });
        resolve(urls);
      }
    });
  });
};

exports.isUrlInList = function(url) {
  var innerPromise = exports.readListOfUrls();
  return innerPromise.then(function (urls) {
    return (urls.indexOf(url) > -1);
  });
};

exports.addUrlToList = function(url) {
  var path = getSitesPath();
  return exports.isUrlInList(url).then(function(exists) {
    return new Promise(function (resolve, reject) {
      if (!exists) {
        fs.appendFile(path, '\n' + url, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
};

exports.getArchivedPath = function(url) {
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  var path = basePath + '/sites' + url;
  return path;
};

exports.isUrlArchived = function(url) {
  var path = exports.getArchivedPath(url);
  return new Promise(function (resolve, reject) {
    fs.exists(path, function(exists) {
      resolve(exists);
    });
  });
};

exports.downloadUrl = function(url) {
  var webUrl = url;
  if (!url.startsWith('http')) {
    webUrl = 'http://' + url;
  }
  return new Promise(function (resolve, reject) {
    http.get(webUrl, function (response) {
      response.on('data', function (chunk) {
        resolve(chunk.toString());
      });
    });
  }).then(function (chunk) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(exports.getArchivedPath(url), chunk, function () {
        resolve();
      });
    });
  });
};

exports.downloadUrls = function(urls) {
  var promiseArray = urls.map(function (url) {
    return exports.isUrlArchived(url).then(function (exists) {
      if (!exists) {
        return exports.downloadUrl(url);
      } else {
        return null;
      }
    });
  });

  return Promise.all(promiseArray);
};
