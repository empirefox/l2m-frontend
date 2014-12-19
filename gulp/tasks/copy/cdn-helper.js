var replace = require('gulp-replace');
var Lazy = require("lazy.js");

var cdnReplacer = {
	css : {
		reg : /<!--\s*jsdelivr-css\s*-->/g,
		tpl : '<link rel="stylesheet" href="//cdn.jsdelivr.net/g/{{cdns}}" />'
	},
	js : {
		reg : /<!--\s*jsdelivr-js\s*-->/g,
		tpl : '<script src="//cdn.jsdelivr.net/g/{{cdns}}"></script>'
	}
};

var helper = {

	toJsdelivr : function(replacer, names) {
		var cdns = Lazy(names).compact().map(function(cdn) {
			var files = ( typeof cdn.files === 'string' && cdn.files.length > 0) ? '(' + cdn.files + ')' : '';
			return cdn.package + files;
		}).join();
		var markup = cdns === '' ? '' : replacer.tpl.replace('{{cdns}}', cdns);
		return replace(replacer.reg, markup);
	},

	toStaticfilesCDN : function() {
		return replace(/\/\/cdnjs\.cloudflare\.com\/ajax\/libs/g, '//cdn.staticfile.org');
	}
};

helper.toJsdelivrCss = function(names) {
	return helper.toJsdelivr(cdnReplacer.css, names);
};

helper.toJsdelivrJs = function(names) {
	return helper.toJsdelivr(cdnReplacer.js, names);
};

module.exports = helper;