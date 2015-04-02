#!/usr/local/bin/node

'use strict';
var app = require('../index.js');
var verbose = require('verboser');
var nopt = require('nopt');
var knownOpts = {
	"file": String
};
var args = nopt(knownOpts);


if (args.file) {
	verbose.force();
	return app(args.file);
}
