var gulp = require('gulp'),
    protractor = require('gulp-protractor').protractor,
    webdriverStandalone = require('gulp-protractor').webdriver_standalone,
    webdriverUpdate = require('gulp-protractor').webdriver_update,
    config = require('../../config').script;

// Update/install webdriver.
gulp.task('webdriver:update', webdriverUpdate);

// Run webdriver standalone server indefinitely.
// Usually not required.
gulp.task('webdriver:standalone', ['webdriver:update'], webdriverStandalone);

// Run e2e tests using protractor.
// Make sure server task is running.
gulp.task('test:e2e', ['webdriver:update'], function() {
	return gulp.src('./foobar').pipe(protractor({
		configFile : 'protractor.conf.js',
	})).on('error', function(e) {
		throw e
	});
});

// Run e2e tests using protractor and watch for changes.
// Make sure server task is running.
gulp.task('test:e2e:auto', ['test:e2e'], function() {
	gulp.watch([config.src], ['test:e2e']);
});