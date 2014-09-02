#!/usr/local/bin/node
/*
 * sass-get-dependents
 * https://github.com/tbremer/sass-get-dependents
 *
 * Copyright (c) 2014 Thomas Bremer, contributors
 * Licensed under the MIT license.
*/
'use strict';
var startTime = Date.now();
var fs = require('fs');
var glob = require('glob');
var nopt = require("nopt");
var path = require('path');
var verbose = require('verboser');
var knownOpts = {
	"file": String
};
var args = nopt(knownOpts);
var encoding = {encoding: 'utf8'};

var escapeDirectories = function (string) {
	return string.replace(/\//g, "\\/");
};

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

var buildRelPaths = function (from, to, ext) {
	var curPath = path.relative(from, to).replace('../','').replace('/_','/').replace(ext, '');

	if (path.basename(curPath)[0] === "_") {
		curPath = curPath.replace('_', '');
	}
	return curPath;
};

var readImportStatements = function (file, statements) {
	var contents = fs.readFileSync(file, encoding);
	var dependentFiles = [];
	statements.forEach(function (curStatement) {
		curStatement = new RegExp(escapeDirectories(curStatement));
		if (curStatement.test(contents) && dependentFiles.indexOf(file) === -1) {
			dependentFiles.push(file);
		}
	});
	return dependentFiles;
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
	var hasPartiasl = true;
	var allRelPaths = [];
	var allDependentFiles = [];

	verbose.log('These files have import statements:');
	verbose.error(filesWithImports).linebreak();

	// We have files with import statements, now lets build relPaths to check.
	filesWithImports.forEach(function (cur) {
		var relPaths = buildRelPaths(cur, source, fileExt);
		if (relPaths.length > 0 && allRelPaths.indexOf(relPaths) === -1) {
			allRelPaths.push(relPaths);
		}
	});

	verbose.log('These are the relative paths:');
	verbose.log(allRelPaths);

	// We have relPaths, lets check the files with import statements.
	filesWithImports.forEach(function (cur) {
		var push = readImportStatements(cur, allRelPaths);
		allDependentFiles.push(push);
	});

	allDependentFiles = allDependentFiles.reduce(function(prev, cur) {
	    return prev.concat(cur);
	});

	if (allDependentFiles.length > 0) {
		verbose.log('These are all the dependentFiles:');
		verbose.log(allDependentFiles);
		return allDependentFiles;
	}
};

// Executable bits
if (args.file) {
	verbose.force();
	module.exports(args.file);
}

var endTime = Date.now();
verbose.log(endTime - startTime + 'ms to complete');
