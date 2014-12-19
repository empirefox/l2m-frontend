var gulp = require('gulp');
var Lazy = require("lazy.js");
var plugins = require('gulp-load-plugins')();
var streamqueue = require('streamqueue');
var resource = require('../../resource.json').local || {};
var toStaticfilesCDN = require('./cdn-helper').toStaticfilesCDN();
var config = require('../../config').scripts;

gulp.task('copy:scripts', function() {
    var src = Lazy([resource.js, config.src]).flatten().toArray();

	return streamqueue({
		objectMode : true
	}, gulp.src(src), gulp.src(config.tpl).pipe(plugins.angularTemplatecache({
		standalone : true,
		module : 'l2m-tpl',
		root : '/views'
	}))).pipe(plugins.concat(config.name)).pipe(toStaticfilesCDN)
	//.pipe(plugins.uglify())
	.pipe(gulp.dest(config.dest));
});