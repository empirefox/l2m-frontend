var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var streamqueue = require('streamqueue');
var toStaticfilesCDN = require('./toStaticfilesCDN')();
var jsLib = require('./jsLib.json');
var bsCssFiles = require('./bsCssFiles.json');
var config = require('../../config').scripts;

gulp.task('copy:scripts', function() {
	return streamqueue({
		objectMode : true
	}, gulp.src(jsLib), gulp.src(config.src), gulp.src(config.tpl).pipe(plugins.angularTemplatecache({
		standalone : true,
		module : 'l2m-tpl',
		root : '/views'
	}))).pipe(plugins.concat(config.name)).pipe(plugins.cdnizer({
		fallbackTest : null,
		matchers : [/(["'])({{.+?}})(["'])/gi],
		files : bsCssFiles
	})).pipe(toStaticfilesCDN)
	//.pipe(plugins.uglify())
	.pipe(gulp.dest(config.dest));
});