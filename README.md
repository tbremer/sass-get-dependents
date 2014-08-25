# SASS-GET-DEPENDENCIES
Return a list of files that depend on your SCSS/SASS partial.


## Example:
```javascript
dependentFiles = require('sass-get-dependencies');

// Array of dependent files
var files = dependentFiles(src);
console.log(files);
```
