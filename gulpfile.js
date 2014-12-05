var cdnizerFiles = [
              		  	'cdnjs:jquery',
              		  	'cdnjs:angular.js:angular-animate.min.js',
              		  	'cdnjs:angular.js:angular-resource.min.js',
                        'cdnjs:angular.js:angular-route.min.js',
                        'cdnjs:angular.js:angular-sanitize.min.js',
                        'cdnjs:angular.js:angular.min.js',
                        {
                            file: '**/angular-translate/*.js',
                            package: 'angular-translate',
                            cdn: 'cdnjs:bower-angular-translate:angular-translate.min.js'
                        },
              		  	'cdnjs:angular-i18n:angular-locale_zh-cn.js',
              		  	{
              		  		file: '**/angular-ui-bootstrap/**/*.js',
              		  		cdn: 'cdnjs:angular-ui-bootstrap:ui-bootstrap-tpls.min.js'
              		  	},
              		  	{
              		  	    file: '**/angular-filter/**/*.js',
                            package: 'angular-filter',
              		  	    cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-filter/${ version }/${ filenameMin }'
              		  	},
                        {
                            file: '**/angularjs-toaster/*.js',
                            cdn: 'cdnjs:angularjs-toaster:${ filenameMin }'
                        },
                		{
                			file: '**/angularjs-toaster/*.css',
                			cdn: 'cdnjs:angularjs-toaster:${ filenameMin }'
                		},
                		'cdnjs:font-awesome',
                		{
                			file: '**/spectrum/spectrum.js',
                			cdn: 'cdnjs:spectrum:js/${ filenameMin }'
                		},
                		{
                			file: '**/spectrum/*.css',
                			cdn: 'cdnjs:spectrum:css/${ filenameMin }'
                		},
//                		{
//                			file: '**/spectrum/i18n/*.js',
//                			cdn: 'cdnjs:spectrum-i18n:js/${ filenameMin }'
//                		},
                		{
                			file: '**/string.js',
                			package: 'string',
                			cdn: 'cdnjs:string.js:${ filenameMin }'
                		},
                		{
                			file: '**/bootstrap/**/bootstrap.css',
                			package: 'bootstrap',
                			cdn: 'cdnjs:twitter-bootstrap:css/bootstrap.min.css'
                		}
               		];

var bsCssFiles = [
                		{
                			file: '{{font-awesome.css}}',
                			cdn: 'cdnjs:font-awesome'
                		},
                		{
                			file: '{{bootstrap.css}}',
                			package: 'bootstrap',
                			cdn: 'cdnjs:twitter-bootstrap:css/bootstrap.min.css'
                		}
               		];

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(); // Load all gulp plugins
                                              // automatically and attach
                                              // them to the `plugins` object

var runSequence = require('run-sequence');    // Temporary solution until gulp 4
                                              // https://github.com/gulpjs/gulp/issues/355
var template = require('lodash').template;

var pkg = require('./package.json');
var dirs = pkg['h5bp-configs'].directories;

// init vars
var toStaticfilesCDN = function(){
    return plugins.replace(/\/\/cdnjs\.cloudflare\.com\/ajax\/libs/g, '//cdn.staticfile.org');
};

// -----------------------------------------------------------------------------
// | Helper tasks                                                              |
// -----------------------------------------------------------------------------

gulp.task('archive:create_archive_dir', function () {
    fs.mkdirSync(path.resolve(dirs.archive), '0755');
});

gulp.task('archive:zip', function (done) {

    var archiveName = path.resolve(dirs.archive, pkg.name + '_v' + pkg.version + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath)
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});

gulp.task('clean', function (done) {
    require('del')([
        template('<%= archive %>', dirs),
        template('<%= dist %>', dirs)
    ], done);
});

//ke,pluralize
gulp.task('copy', [
    'copy:index.html',
    'copy:main.css',
    'copy:misc',
    'copy:vendor-ke',
    'copy:ke',
    'copy:tpl',
    'copy:app'
]);

gulp.task('copy:index.html', function () {
    return gulp.src(template('<%= src %>/index.html', dirs))
               .pipe(plugins.cdnizer({
               		//relativeRoot: template('<%= src %>', dirs),
               		fallbackTest: null,
               		files: cdnizerFiles}))
               .pipe(toStaticfilesCDN())
               .pipe(gulp.dest(template('<%= dist %>', dirs)));
});

gulp.task('copy:main.css', function () {

    var banner = '/*! L2M v' + pkg.version +
                    ' | ' + pkg.license.type + ' License' +
                    ' | ' + pkg.homepage + ' */\n\n';

    return gulp.src(['bower_components/angular-ui-tree/dist/angular-ui-tree.min.css',
                    'bower_components/angular-dialog-service/dist/dialogs.min.css',
                    template('<%= src %>/styles/main.css', dirs)])
               .pipe(plugins.header(banner))
               .pipe(gulp.dest(template('<%= dist %>/css', dirs)));

});

gulp.task('copy:misc', function () {
    return gulp.src([

        // Copy all files
        template('<%= src %>/*', dirs),

        // Exclude the following files
        // (other tasks will handle the copying of these files)
        template('!<%= src %>/index.html', dirs),
        template('!<%= src %>/scripts', dirs),
        template('!<%= src %>/styles', dirs),
        template('!<%= src %>/views', dirs)

    ], {
        // Include hidden files by default
        dot: true
    }).pipe(gulp.dest(template('<%= dist %>', dirs)));
});

gulp.task('copy:vendor-ke', function () {
    return gulp.src([
    				'bower_components/pluralize/pluralize.js',
    				'bower_components/angular-ui-tree/dist/angular-ui-tree.js',
    				'bower_components/angular-dialog-service/dist/dialogs.min.js',
    				'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.js',
    				'lib/messenger.js'
    			])
    		   .pipe(plugins.concat('vendor-ke.min.js'))
    		   .pipe(plugins.uglify())
               .pipe(gulp.dest(template('<%= dist %>/js', dirs)));
});

gulp.task('copy:ke', function () {
    return gulp.src('lib/ke/**/*')
               .pipe(gulp.dest(template('<%= dist %>/ke', dirs)));
});

gulp.task('copy:tpl', function () {
	return gulp.src(template('<%= src %>/views/**/*.html', dirs))
			   .pipe(plugins.angularTemplatecache('l2m-tpl.min.js',{
			   		standalone:true,
			   		module: 'l2m-tpl',
			   		root: '/views'
			   }))
			   .pipe(plugins.uglify())
			   .pipe(gulp.dest(template('<%= dist %>/js', dirs)));
});

gulp.task('copy:app', function () {
    return gulp.src(template('<%= src %>/scripts/**/*.js', dirs))
               .pipe(plugins.concat('app.min.js'))
               .pipe(plugins.cdnizer({
                    fallbackTest: null,
                    matchers: [/(["'])({{.+?}})(["'])/gi],
                    files: bsCssFiles}))
               .pipe(toStaticfilesCDN())
               .pipe(plugins.uglify())
               .pipe(gulp.dest(template('<%= dist %>/js', dirs)));
});

gulp.task('jshint', function () {
    return gulp.src([
        'gulpfile.js',
        template('<%= src %>/scripts/**/*.js', dirs)
    ]).pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.jshint.reporter('fail'));
});


// -----------------------------------------------------------------------------
// | Main tasks                                                                |
// -----------------------------------------------------------------------------

gulp.task('archive', function (done) {
    runSequence(
        'build',
        'archive:create_archive_dir',
        'archive:zip',
    done);
});

gulp.task('build', function (done) {
    runSequence(
        ['clean', 'jshint'],
        'copy',
    done);
});

gulp.task('test:unit', function() {
	// Be sure to return the stream
	// NOTE: Using the fake './foobar' so as to run the files
	// listed in karma.conf.js INSTEAD of what was passed to
	// gulp.src !
	return gulp.src('./foobar').pipe(plugins.karma({
		configFile : 'karma.conf.js',
		action : 'run'
	})).on('error', function(err) {
		// Make sure failed tests cause gulp to exit non-zero
		console.log(err);
		this.emit('end');
		//instead of erroring the stream, end it
	});
});

gulp.task('test:unit:auto', function() {
	return gulp.watch([template('<%= src %>/scripts/**/*.js', dirs)], ['test']);
});

gulp.task('default', ['test:unit', 'build']);
