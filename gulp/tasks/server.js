var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var swig = require('swig');
var express = require('express');
var config = require('../config');
var Lazy = require("lazy.js");
var resource = require('../resource.json');
var helper = require('../helper');

var jsdelivrJs = helper.jsdelivrLocalJs;
var jsdelivrCss = helper.jsdelivrLocalCss;

function indexHandler(req, res, next) {
	gulp.src(config['index.html'].src)
	// inject css files to html
	.pipe(plugins.inject(gulp.src(Lazy([resource.cdn.css, helper.jsdelivrLocalCss]).flatten().compact().toArray(), {
		read : false
	}), {
		name : 'head'
	}))
	// inject js files to html
	.pipe(plugins.inject(gulp.src(Lazy([resource.cdn.js, helper.jsdelivrLocalJs]).flatten().compact().toArray(), {
		read : false
	}), {
		name : 'head'
	}))
	// output
	.once('data', function(file) {
		res.write(file.contents);
		res.end();
	});
};

function scenarioHandler(req, res) {
	var scenario = req.params.scenario,
	    view = req.params.view || scenario,
	    js = req.params.js || view;
	res.render(scenario + '/' + view, {
		mainjs : '/e2e/' + scenario + '/' + js + '.main.js'
	});
};

gulp.task('server', function(done) {
	var app = express();

	app.engine('html', new swig.Swig({
		cache : false,
		varControls : ['[[', ']]']
	}).renderFile);
	app.set('view engine', 'html');
	app.set('views', config.render('{{ test }}/e2e'));
	app.set('view cache', false);

	app.get('/', indexHandler);
	app.get('/index.html', indexHandler);
	app.get('/scenario/:scenario/:view?/:js?', scenarioHandler);

	app.use(express.static(config.dest, {
		index : false
	}));
	app.use(express.static(config.render('{{ test }}')));
	app.use(express.static(config.render('{{ src }}')));
	app.use('/bower_components', express.static('./bower_components'));

	app.listen(config.port);
});
