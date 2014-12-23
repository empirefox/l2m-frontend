var gulp = require('gulp');
var karma = require('gulp-karma');
var gutil = require('gulp-util');
var config = require('../../config').script;

gulp.task('test:unit', function() {
	// Be sure to return the stream
	// NOTE: Using the fake './foobar' so as to run the files
	// listed in karma.conf.js INSTEAD of what was passed to
	// gulp.src !
	return gulp.src('./foobar').pipe(karma({
		configFile : 'karma.conf.js',
		action : 'run'
	})).on('error', function(err) {
		// Make sure failed tests cause gulp to exit non-zero
		gutil.log(err);
		this.emit('end');
		//instead of erroring the stream, end it
	});
});

gulp.task('test:unit:auto', function() {
	return gulp.watch([config.src], ['test']);
});