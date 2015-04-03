#!/usr/local/bin/node

'use strict';
var app = require('../index.js'),
    verbose = require('verboser'),
    nopt = require('nopt'),
    knownOpts = {
      'file': String
    },
    args = nopt(knownOpts);

if (args.file) {
  verbose.force();
  return app(args.file);
}
