var gulp = require('gulp');

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

gulp.task('build', function(done) {
	runSequence(['clean', 'jshint'], 'copy', done);
});