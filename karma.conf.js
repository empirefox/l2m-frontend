// Karma configuration
// Generated on Fri Aug 29 2014 10:40:27 GMT+0800 (CST)
var Lazy = require("lazy.js");
var getPath = require("bower-path");
var resource = require('./gulp/resource.json');

var jsdelivrs = [];
Lazy(resource.jsdelivr.js).compact().each(function(cdn) {
	if ( typeof cdn.files === 'string' && cdn.files.length > 0) {
		cdn.files.split('+').forEach(function(file) {
			var segs = file.split('/');
			var name = segs[segs.length - 1];
			jsdelivrs.push('bower_components/' + cdn.package + '/**/' + name);
		});
	} else {
		var main = getPath(cdn.package).split(',')[0].replace('/./', '/');
		jsdelivrs.push(main);
	}
});
var files = Lazy([resource.cdn.js, jsdelivrs, resource.local.js, resource.test]).flatten().toArray();

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath : '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks : ['jasmine'],

		// list of files / patterns to load in the browser
		files : files,

		// list of files to exclude
		exclude : [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors : {
			'src/views/**/*.html' : 'ng-html2js',
			// json_fixtures
			'test/fixtures/**/*.json' : 'json_fixtures'
		},

		ngHtml2JsPreprocessor : {
			stripPrefix : 'src',
			moduleName : 'l2m-tpl'
		},

		jsonFixturesPreprocessor : {
			// strip this from the file path \ fixture name
			stripPrefix : ['test/fixtures/'],
			// strip this to the file path \ fixture name
			prependPrefix : '',
			// change the global fixtures variable name
			variableName : ['__fixtures__']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters : ['progress'],

		// web server port
		port : 9876,

		// enable / disable colors in the output (reporters and logs)
		colors : true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
		// config.LOG_INFO || config.LOG_DEBUG
		logLevel : config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch : true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers : ['PhantomJS'],
		// browsers: ['Chrome', 'Firefox', 'PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun : false
	});
};
