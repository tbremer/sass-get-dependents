#!/usr/local/bin/node

/*
 * sass-get-dependencies
 * https://github.com/tbremer/sass-get-dependencies
 *
 * Copyright (c) 2014 Thomas Bremer, contributors
 * Licensed under the MIT license.
*/
'use strict';
var startTime = Date.now();
var _ = require('underscore');
var chalk = require('chalk');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var isVerbose = (process.argv.indexOf('--verbose') !== -1 || process.argv.indexOf('-v') !== -1) ? true : false;
var encoding = {encoding: 'utf8'};

var escapeDirectories = function (string) {
	return string.replace(/\//g, "\\/");
};

var checkForImports = function (src) {
	var contents;
	var importRegEx = new RegExp("@import");
	var matchingFiles = [];
	src.forEach(function (cur, index, src) {
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
	statements.forEach(function (curStatement, index, array) {
		curStatement = new RegExp(escapeDirectories(curStatement));
		if (curStatement.test(contents) && dependentFiles.indexOf(file) === -1) {
			dependentFiles.push(file);
		}
	});
	return dependentFiles;
};

module.exports = function (source) {
	if (isVerbose) {
		console.log('Checking ' + chalk.cyan(source));
	}

	// Initial file checks -- does exist?.
	if (!fs.existsSync(source)) {
		return false;
	}
	// Initial file checks -- is css?
	if (path.extname(source) === '.css') {
		return false;
	}

	// Okay, the basics are there. Lets build the patterns
	var fileExt = path.extname(source);
	var fileSearch = glob.sync('**/*' + fileExt);
	var filesWithImports = checkForImports(fileSearch);
	var hasPartiasl = true;
	var allRelPaths = [];
	var allDependentFiles = [];

	if (isVerbose) {
		console.log(chalk.cyan('These files have import statements:'));
		console.log(filesWithImports);
	}

	// We have files with import statements, now lets build relPaths to check.
	filesWithImports.forEach(function (cur, index, filesWithImports) {
		var relPaths = buildRelPaths(cur, source, fileExt);
		if (relPaths.length > 0 && allRelPaths.indexOf(relPaths) === -1) {
			allRelPaths.push(relPaths);
		}
	});

	if (isVerbose) {
		console.log(chalk.cyan('These are the relative paths:'));
		console.log(allRelPaths);
	}

	// We have relPaths, lets check the files with import statements.
	filesWithImports.forEach(function (cur, index, filesWithImports) {
		var push = readImportStatements(cur, allRelPaths);
		allDependentFiles.push(push);
	});

	allDependentFiles = _.flatten(allDependentFiles);

	if (allDependentFiles.length > 0) {
		if (isVerbose) {
			console.log(chalk.cyan('These are all the dependentFiles:'));
			console.log(allDependentFiles);
		}
		return allDependentFiles;
	}
};

// Executable bits
var args = process.argv;
var fileRegEx = /--file=[a-zA-Z0-9.-_\/]+/;
var files = [];

args.forEach(function (cur, index, args) {
	if (fileRegEx.test(cur)) {
		var file = cur.split('=').pop();
		files.push(file);
	}
});

files.forEach(function (cur, index, files) {
	module.exports(cur);
});

if (isVerbose) {
	var endTime = Date.now();
	console.log(endTime - startTime + 'ms to complete');
}
