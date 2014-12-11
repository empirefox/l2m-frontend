// Karma configuration
// Generated on Fri Aug 29 2014 10:40:27 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-i18n/angular-locale_zh-cn.js',
      'bower_components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-*.min.js',
      'bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.js',
      'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'bower_components/angular-filter/dist/angular-filter.js',
      'bower_components/angular-dialog-service/dist/dialogs.min.js',
      'bower_components/angularjs-toaster/toaster.js',
      'bower_components/pluralize/pluralize.js',
      'bower_components/spectrum/spectrum.js',
//      'bower_components/spectrum/i18n/jquery.spectrum-zh-cn.js',
      'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.min.js',
      'bower_components/string/lib/string.js',

      'bower_components/angular-mocks/angular-mocks.js',

      'lib/messenger.js',
      'lib/ke/*.js',

      'src/scripts/**/*.js',
      'test/unit/helper.js',
      'test/unit/**/*.js',
      'src/views/**/*.html',

	  'test/fixtures/**/*.json'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    	'src/views/**/*.html': 'ng-html2js',
    	'test/fixtures/**/*.json': 'json_fixtures'
    },

    ngHtml2JsPreprocessor: {
    	stripPrefix: 'src',
    	moduleName: 'l2m-tpl'
    },

    jsonFixturesPreprocessor: {
      // strip this from the file path \ fixture name
      stripPrefix: ['test/fixtures/'],
      // strip this to the file path \ fixture name
      prependPrefix: '',
      // change the global fixtures variable name
      variableName: ['__fixtures__']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
    // browsers: ['Chrome', 'Firefox', 'PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
