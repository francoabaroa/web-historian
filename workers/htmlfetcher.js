// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
var fs = require('fs');

//var basePath = 'archives';

exports.htmlFetcher = function(basePath) {
  archive.readListOfUrls(function(listOfUrls) {
    _.each(listOfUrls, function(url) {
      archive.isUrlArchived(url, function(exists) {
        if (!exists) {
          archive.downloadUrl(url, basePath);
          fs.appendFile('download.log', '\nDownloaded ' + url);
        }
      }, basePath);
    });
  }, basePath);
};


