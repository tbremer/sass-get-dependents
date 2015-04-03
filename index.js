'use strict';
var startTime = Date.now(),
    endTime,
    fs = require('fs'),
    glob = require('glob'),
    path = require('path'),
    verbose = require('verboser'),
    encoding = {encoding: 'utf8'};

var checkForImports = function (src) {
  var contents,
      importRegEx = new RegExp("@import"),
      matchingFiles = [];

  src.forEach(function (cur) {
    contents = fs.readFileSync(cur, encoding);
    if (importRegEx.test(contents) && matchingFiles.indexOf(cur) === -1) {
      matchingFiles.push(cur);
    }
  });
  return matchingFiles;
};

var readImportStatements = function (file, statements) {
  var contents,
      matchingFiles = [],
      basename = path.basename(file, (path.extname(file))),
      fileName = (basename[0] === '_') ? basename.substring(1, basename.length) : basename,
      importRegEx = new RegExp('@import[\\s]+([\'|"./\\w]+?)' + fileName + '[\'|"];?');

  statements.forEach(function (cur) {
    contents = fs.readFileSync(cur, encoding);
    if (importRegEx.test(contents) === true) {
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
  var fileExt = path.extname(source),
      fileSearch = glob.sync('**/*' + fileExt),
      filesWithImports = checkForImports(fileSearch),
      allRelPaths = [],
      allDependentFiles = [];

  verbose.log('These files have import statements:');
  verbose.log(filesWithImports).linebreak();

  allDependentFiles = readImportStatements(source, filesWithImports);

  verbose.log('These are all the dependentFiles:');
  verbose.log(allDependentFiles);
  return allDependentFiles;
};

endTime = Date.now();
verbose.log(endTime - startTime + 'ms to complete');
