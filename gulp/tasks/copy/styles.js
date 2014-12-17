var gulp = require('gulp');
var streamqueue = require('streamqueue');
var concat = require('gulp-concat');
var header = require('gulp-header');
var cssLib = require('./cssLib.json');
var pkg = require('../../../package.json');
var config = require('../../config').styles;

gulp.task('copy:styles', function() {

	var banner = '/*! L2M v' + pkg.version + ' | ' + pkg.license.type + ' License' + ' | ' + pkg.homepage + ' */\n\n';

	return streamqueue({
		objectMode : true
	}, gulp.src(cssLib), gulp.src(config.src)).pipe(concat(config.name)).pipe(header(banner)).pipe(gulp.dest(config.dest));

});