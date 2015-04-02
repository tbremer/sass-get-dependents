'use strict';
var assert = require('assert'),
dependsOn = require('../'),
partials = 'tests/fixtures/partials',
fixtures = 'tests/fixtures',
notCreated = partials + '/_not_real.scss',
css = partials + '/_dependentFiles_test_css.css',
scss = partials + '/_dependentFiles_test_scss.scss',
sass = partials + '/_dependentFiles_test_sass.sass',
scssTwoDeep = partials + '/_import_into_partial_scss.scss',
multipleFiles = partials + '/_import_in_two_files.scss';

describe('sass-get-dependents', function () {
  it('fails when files don\'t exist', function () {
    var actual = dependsOn(notCreated),
    expected = [];

    assert.deepEqual(actual, expected);
  });

  it('doesn\'t test *.css files', function () {
    var actual = dependsOn(css),
    expected = [];

    assert.deepEqual(actual, expected);
  });

  it('reads files', function () {
    var actual = dependsOn(scss),
    expected = ['tests/fixtures/import_partial_scss.scss'];

    assert.deepEqual(actual, expected);
  });

  it('returns multiple files when partials import partials', function () {
    var actual = dependsOn(scssTwoDeep),
    expected = ['tests/fixtures/partials/_partial_importing_partial_scss.scss', 'tests/fixtures/partial_two_deep_scss.scss'];


    assert.deepEqual(actual, expected);
  });

  it('returns multiple files when partials are required in them.', function () {
    var actual = dependsOn(multipleFiles),
    expected = ['tests/fixtures/import_across_2_files_1-2.scss', 'tests/fixtures/import_across_2_files_2-2.scss'];

    assert.deepEqual(actual, expected);
  });
});
