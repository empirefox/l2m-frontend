var gulp = require('gulp');
var config = require('../../config').misc;


gulp.task('copy:misc', function () {
    return gulp.src(config.src, {
        // Include hidden files by default
        dot: true
    }).pipe(gulp.dest(config.dest));
});