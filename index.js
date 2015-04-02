'use strict';
var startTime = Date.now();
var endTime;
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var verbose = require('verboser');
var encoding = {encoding: 'utf8'};

var checkForImports = function (src) {
  var contents;
  var importRegEx = new RegExp("@import");
  var matchingFiles = [];
  src.forEach(function (cur) {
    contents = fs.readFileSync(cur, encoding);
    if (importRegEx.test(contents) && matchingFiles.indexOf(cur) === -1) {
      matchingFiles.push(cur);
    }
  });
  return matchingFiles;
};

var readImportStatements = function (file, statements) {
  var contents;
  var matchingFiles = [];
  var basename = path.basename(file, (path.extname(file)));
  var fileName = (basename[0] === '_') ? basename.substring(1, basename.length) : basename;
  var importRegEx = new RegExp('@import[\\s]+([\'|"./\\w]+?)' + fileName + '[\'|"];?');

  statements.forEach(function (cur) {
    contents = fs.readFileSync(cur, encoding);
    if (importRegEx.test(contents) == true) {
      matchingFiles.push(cur);
    }
  });
  return matchingFiles;
};

module.exports = function (source) {
  verbose.log('Checking ' + source).linebreak();

  // Initial file checks -- does exist?.
  if (!fs.existsSync(source)) {
    return [];
  }
  // Initial file checks -- is css?
  if (path.extname(source) === '.css') {
    return [];
  }

  // Okay, the basics are there. Lets build the patterns
  var fileExt = path.extname(source);
  var fileSearch = glob.sync('**/*' + fileExt);
  var filesWithImports = checkForImports(fileSearch);
  var allRelPaths = [];
  var allDependentFiles = [];

  verbose.log('These files have import statements:');
  verbose.log(filesWithImports).linebreak();

  allDependentFiles = readImportStatements(source, filesWithImports);

  verbose.log('These are all the dependentFiles:');
  verbose.log(allDependentFiles);
  return allDependentFiles;
};

endTime = Date.now();
verbose.log(endTime - startTime + 'ms to complete');
