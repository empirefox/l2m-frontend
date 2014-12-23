var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var express = require('express');
var config = require('../config');
var Lazy = require("lazy.js");
var resource = require('../resource.json');
var helper = require('../helper');

var jsdelivrJs = helper.jsdelivrLocalJs;
var jsdelivrCss = helper.jsdelivrLocalCss;

gulp.task('server', function(done) {
	var app = express();

	app.get('/index.html', function(req, res, next) {
		gulp.src(config['index.html'].src)
		// inject css files to html
		.pipe(plugins.inject(gulp.src(Lazy([resource.cdn.css, helper.jsdelivrLocalCss]).flatten().toArray(), {
			read : false
		}), {
			name : 'head'
		}))
		// inject js files to html
		.pipe(plugins.inject(gulp.src(Lazy([resource.cdn.js, helper.jsdelivrLocalJs]).flatten().toArray(), {
			read : false
		}), {
			name : 'head'
		}))
		// output
		.pipe(res);
	});

	app.use(express.static(config.dest));
	app.use(express.static(config.render('{{ test }}')));

	app.listen(config.port);
});
