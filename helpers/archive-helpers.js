var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

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

var getSitesPath = function (basePath) {
  if (basePath === undefined) {
    basePath = 'test/testdata';
  }
  return basePath + '/sites.txt';
};

exports.readListOfUrls = function(callback, basePath) {
  var urls;
  var ourPath = getSitesPath(basePath);
  fs.readFile(ourPath, function(err, data) {
    data = data.toString();
    if (err) {
      return;
    }
    urls = data.split('\n');
    if (callback) {
      callback(urls);
    }
  });
};

exports.isUrlInList = function(url, callback, basePath) {
  var exists;
  exports.readListOfUrls(function(innerUrls) {
    if (innerUrls.indexOf(url) > -1) {
      exists = true;
    } else {
      exists = false;
    }
    callback(exists);
  }, basePath);
};

exports.addUrlToList = function(url, callback, basePath) {
  exports.isUrlInList(url, function(exists) {
    var path = getSitesPath(basePath);
    if (!exists) {
      fs.appendFile(path, '\n' + url, callback);
    }
  });
};

var getArchivedPath = function(url, basePath) {
  if (basePath === undefined) {
    basePath = 'test/testdata';
  }
  basePath += '/sites/' + url;
  return basePath;
};

exports.isUrlArchived = function(url, callback, basePath) {
  var path = getArchivedPath(url, basePath);
  fs.exists(path, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function() {
};
