var gulp = require('gulp');
var Lazy = require("lazy.js");
var concat = require('gulp-concat');
var header = require('gulp-header');
var resource = require('../../resource.json').local || {};
var pkg = require('../../../package.json');
var config = require('../../config').styles;

gulp.task('copy:styles', function() {

	var banner = '/*! L2M v' + pkg.version + ' | ' + pkg.license.type + ' License' + ' | ' + pkg.homepage + ' */\n\n';

	var src = Lazy([resource.css, config.src]).flatten().toArray();
	return gulp.src(src).pipe(concat(config.name)).pipe(header(banner)).pipe(gulp.dest(config.dest));

});