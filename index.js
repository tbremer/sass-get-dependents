/*
 * sass-partial-dependencies
 * https://github.com/tbremer/sass-partial-dependencies
 *
 * Copyright (c) 2014 Thomas Bremer, contributors
 * Licensed under the MIT license.
 */
 'use strict';
 var fs = require('fs');
 var path = require('path');
 var chalk = require('chalk');
 var glob = require('glob');
 var _ = require('underscore');

 module.exports = function(needle, haystack) {
 	var timerStart = Date.now();
 	var isVerbose = (process.argv.indexOf('--verbose') !== -1 || process.argv.indexOf('-v') !== -1) ? true : false;

	// Check if file exists | return false
	if (!fs.existsSync(needle)) {
		if (isVerbose) {
			console.log(chalk.cyan('File doesn\'t exist.'));
		}
		return false;
	}
	// Check if file is a *.css file, SASS doesn't import those
	if (path.extname(needle) === '.css') {
		if (isVerbose) {
			console.log(chalk.cyan('SASS won\'t import *.css files'));
		}
		return false;
	}

	//Look for verbose for logging options
	// We have passed our base checks, lets define some variables.

	var dependentFiles = [],
	    ext            = path.extname(needle);

	// If a hastack wasn't sent in, then we define it here. We also remove the needle from the haystack.
	if (haystack === undefined) {
		haystack = glob.sync('**/*' + ext);
	}
	haystack = _.without(haystack, needle);

	_.each(haystack, function(straw, index, array) {
		var thisContents, relPath, isDependent, isPartial;
		thisContents = fs.readFileSync(straw, {encoding: 'utf8'});
		relPath = path.relative(straw, needle).replace('../', '').replace('/_','/').replace(ext, '');
		if (relPath[0] === '_') {
			relPath = relPath.replace('_','');
		}
		isDependent = thisContents.indexOf(relPath) !== -1 ? true : false;
		if (isDependent) {
			isPartial = path.basename(straw)[0] === '_' ? true : false;
			if (isPartial) {
				if (isVerbose) {
					console.log(chalk.cyan(path.basename(needle)), chalk.white(' is a partial, adding it to the haystack'));
				}
				array.push(needle);
			} else {
				dependentFiles.push(straw);
			}
		}
	});


	if(dependentFiles.length === 0) {
		if (isVerbose) {
			console.log(chalk.cyan(path.basename(needle)), chalk.white(' does not have any dependencies'));
		}
		return false;
	}
	if (isVerbose) {
		console.log('Dependencies: ' + chalk.cyan(dependentFiles.join(', ')));
	}
	var timerEnd = Date.now();
	if (isVerbose) {
		console.log('sass-get-dependencies took: ' + chalk.cyan((timerEnd - timerStart) + 'ms'));
	}
	return dependentFiles;
};
