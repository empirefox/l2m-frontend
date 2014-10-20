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
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-*.min.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-i18n/angular-locale_zh-cn.js',
      'bower_components/pluralize/pluralize.js',
      'bower_components/spectrum/spectrum.js',
      'bower_components/spectrum/i18n/jquery.spectrum-zh-cn.js',
      'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.min.js',
      'lib/messenger.js',
      'lib/ke/*.js',
      'src/scripts/**/*.js',
      'test/unit/**/*.js',
      'src/views/**/*.html'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    	'src/views/**/*.html': 'ng-html2js'
    },
    
    ngHtml2JsPreprocessor: {
    	stripPrefix: 'src',
    	moduleName: 'l2m-tpl'
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
