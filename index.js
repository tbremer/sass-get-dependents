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

module.exports = function(needle, haystack) {
	console.log(chalk.red.bhWhite('hello'));
	console.log(chalk.red.bgWhite(needle));
	if (haystack==='undefined') {
		console.log('nope');
	}

	// Check if file exists | return false

	// Check that file isn't *.css | return false

	// Build relative path

	// Look for relative path in file(s).
		// push to array of files
	// Return array of files
}
