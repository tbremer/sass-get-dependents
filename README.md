# SASS-GET-DEPENDENTS
*Return a list of files that depend on your SCSS/SASS partial.*
[![Travis CI](https://img.shields.io/travis/tbremer/sass-get-dependents.svg?style=flat-square)](https://travis-ci.org/tbremer/sass-get-dependents)
[![Version](https://img.shields.io/npm/v/sass-get-dependents.svg?style=flat-square)](https://www.npmjs.com/package/sass-get-dependents)
[![NPM Downloads](https://img.shields.io/npm/dm/sass-get-dependents.svg?style=flat-square)](https://www.npmjs.com/package/sass-get-dependents)
[![LICENSE](https://img.shields.io/npm/l/sass-get-dependents.svg?style=flat-square)](https://github.com/tbremer/sass-get-dependents/blob/master/LICENSE)


## Example:
```javascript
dependentFiles = require('sass-get-dependents');

// Array of dependent files
var files = dependentFiles(src);
console.log(files);
```
## As a CLI
`npm install -g sass-get-dependents`

From within SASS Structure
```bash
$ getDependents --file=path/to/partial/file
```
