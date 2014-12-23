var Lazy = require("lazy.js");
var resource = require('./resource.json');
var config = require('./config');

var helper = {
	getJsdelivrLocal : function(cdns) {
		var urls = [];
		Lazy(cdns).compact().each(function(cdn) {
			if ( typeof cdn.files === 'string' && cdn.files.length > 0) {
				cdn.files.split('+').forEach(function(file) {
					var segs = file.split('/');
					var name = segs[segs.length - 1];
					urls.push('bower_components/' + cdn.package + '/**/' + name);
				});
			} else {
				var main = getPath(cdn.package).split(',')[0].replace('/./', '/');
				urls.push(main);
			}
		});
		return urls;
	}
};

helper.jsdelivrLocalJs = helper.getJsdelivrLocal(resource.jsdelivr.js);
helper.jsdelivrLocalCss = helper.getJsdelivrLocal(resource.jsdelivr.css);

var units = [resource.test, config.scripts.src, config.scripts.tpl, config.test.fixtures, config.test.unit];
helper.karmaFiles = Lazy([resource.cdn.js, helper.jsdelivrLocalJs, resource.local.js, units]).flatten().compact().toArray();

module.exports = helper;
