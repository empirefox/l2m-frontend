var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var cdnizerFiles = require('./cdnizerFiles.json');
var toStaticfilesCDN = require('./toStaticfilesCDN')();
var config = require('../../config')['index.html'];

gulp.task('copy:index.html', function() {
	return gulp.src(config.src).pipe(plugins.cdnizer({
		//relativeRoot: template('<%= src %>', dirs),
		fallbackTest : null,
		files : cdnizerFiles
	})).pipe(toStaticfilesCDN).pipe(gulp.dest(config.dest));
});