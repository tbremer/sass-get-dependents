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
	// Check if file exists | return false
	if (!fs.existsSync(needle)) {
		console.log(chalk.white.bgRed('File doesn\'t exist.'));
		return false;
	}
	// Check if file is a *.css file, SASS doesn't import those
	if (path.extname(needle) === '.css') {
		console.log(chalk.white.bgRed('SASS won\'t import *.css files'));
		return false;
	}

	// We have passed our base checks, lets define some variables.
	var dependentFiles = [],
	ext = path.extname(needle);

	// If a hastack wasn't sent in, then we define it here. We also remove the needle from the haystack.
	if (haystack === undefined) {
		haystack = glob.sync('**/*' + ext);
	}
	haystack = _.without(haystack, needle);

	_.each(haystack, function(straw) {
		var thisContents, relPath, isDependent, isPartial;
		thisContents = fs.readFileSync(straw, {encoding: 'utf8'});
		relPath = path.relative(straw, needle).replace('../', '').replace('/_','/').replace(ext, '');
		if(relPath[0] === '_') {
			relPath.replace('_','');
		}
		isDependent = thisContents.indexOf(relPath) !== -1 ? true : false;
		if(isDependent) {
			isPartial = path.basename(straw)[0] === '_' ? true : false;
			if(isPartial) {
				haystack.push(straw);
			} else {
				dependentFiles.push(straw);
			}
		}
	});

	return dependentFiles;
};
