// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
var fs = require('fs');


exports.htmlFetcher = function() {
  var promiseArray = archive.readListOfUrls().then(function(listOfUrls) {
    return listOfUrls.map(function(url) {
      console.log('url', url);
      return archive.isUrlArchived(url).then(function(exists) {
        if (!exists) {
          return archive.downloadUrl(url).then(function () {
            fs.appendFile('download.log', '\nDownloaded ' + url);
          });
        } else {
          return null;
        }
      });
    });
  });
  return Promise.all(promiseArray);
};


