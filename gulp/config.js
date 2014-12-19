var swig = require('swig');
var r = new swig.Swig({
	locals : {
		src : './src',
		dest : './dist'
	}
}).render;

var config = {
	dest : r('{{ dest }}'),
	'index.html' : {
		src : r('{{ src }}/index.html'),
		dest : r('{{ dest }}')
	},
	scripts : {
		src : r('{{ src }}/scripts/**/*.js'),
		tpl : r('{{ src }}/views/**/*.html'),
		dest : r('{{ dest }}/js'),
		name : 'app.min.js'
	},
	styles : {
		src : r('{{ src }}/styles/*.css'),
		dest : r('{{ dest }}/css'),
		name : 'app.css'
	},
	misc : {
		src : [r('{{ src }}/.*'), r('!{{ src }}/index.html'), r('!{{ src }}/scripts'), r('!{{ src }}/styles'), r('!{{ src }}/views')],
		dest : r('{{ dest }}')
	},

	sass : {
		src : r('{{ src }}/sass/*.{sass,scss}'),
		dest : r('{{ dest }}'),
		settings : {
			// Required if you want to use SASS syntax
			// See https://github.com/dlmanning/gulp-sass/issues/81
			sourceComments : 'map',
			imagePath : '/images' // Used by the image-url helper
		}
	},
	images : {
		src : r("{{ src }}/images/**"),
		dest : r("{{ dest }}/images")
	},
	browserify : {
		// Enable source maps
		debug : true,
		// Additional file extentions to make optional
		extensions : ['.coffee', '.hbs'],
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs : [{
			entries : r('{{ src }}/javascript/app.coffee'),
			dest : r('{{ dest }}'),
			outputName : 'app.js'
		}, {
			entries : r('{{ src }}/javascript/head.coffee'),
			dest : r('{{ dest }}'),
			outputName : 'head.js'
		}]
	}
};

module.exports = config;
