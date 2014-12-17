var gulp = require('gulp');
var jshint = require('gulp-jshint');
var config = require('../config').scripts;

gulp.task('jshint', function() {
	return gulp.src(['gulpfile.js', config.src]).pipe(jshint()).pipe(jshint.reporter('jshint-stylish')).pipe(jshint.reporter('fail'));
});