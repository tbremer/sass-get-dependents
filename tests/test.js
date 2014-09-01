'use strict';
var assert = require('assert');
var dependsOn = require("../");

var partials = 'tests/fixtures/partials';
var fixtures = 'tests/fixtures';

var notCreated = partials + '/_not_real.scss';
var css = partials + '/_dependentFiles_test_css.css';

var scss = partials + '/_dependentFiles_test_scss.scss';
var sass = partials + '/_dependentFiles_test_sass.sass';
var scssTwoDeep = partials + '/_import_into_partial_scss.scss';
var multipleFiles = partials + '/_import_in_two_files.scss';

describe('sass-get-dependencies', function () {
	it('fails when files don\'t exist', function () {
		var actual = dependsOn(notCreated);
		var expected = [];

		assert.deepEqual(actual, expected);
	});

	it('doesn\'t test *.css files', function () {
		var actual = dependsOn(css);
		var expected = [];

		assert.deepEqual(actual, expected);
	});

	it('reads files', function () {
		var actual = dependsOn(scss);
		var expected = ['tests/fixtures/import_partial_scss.scss'];

		assert.deepEqual(actual, expected);
	});

	it('returns when partials import partias', function () {
		var actual = dependsOn(scssTwoDeep);
		var expected =  ['tests/fixtures/partials/_partial_importing_partial_scss.scss' ];

		assert.deepEqual(actual, expected);
	});

	it('returns multiple files when partials are required in them.', function () {
		var actual = dependsOn(multipleFiles);
		var expected = ['tests/fixtures/import_across_2_files_1-2.scss', 'tests/fixtures/import_across_2_files_2-2.scss'];

		assert.deepEqual(actual, expected);
	});
});



// describe('sass-get-dependencies', function () {
// 	it('returns files dependent on scss files', function () {
// 		var actual = dependsOn(scss);
// 		var expected = [
// 			fixtures + '/import_partial_scss.scss'
// 		];
// 		assert.deepEqual(actual, expected);
// 	});

// 	it('returns files dependent on sass files', function () {
// 		var actual = dependsOn(sass);
// 		var expected = [
// 			fixtures + '/import_partial_sass.sass'
// 		];
// 		assert.deepEqual(actual, expected);
// 	});

// 	it('does not process css files', function () {
// 		var actual = dependsOn(css);
// 		var expected = false;
// 		expect(actual).to.be(false);
// 	});

// 	it('finds when partials require partials', function () {
// 		var actual = dependsOn(scssTwoDeep);
// 		var expected = [
// 			fixtures + '/partial_two_deep_scss.scss'
// 		];
// 		assert.deepEqual(actual, expected);
// 	});
// });
