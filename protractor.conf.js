var config = require('./gulp/config.js');

exports.config = {
	jasmineNodeOpts : {
		showColors : true,
		defaultTimeoutInterval : 30000
	},

	specs : [config.test.e2e],

	capabilities : {
		'browserName' : 'chrome'
	},

	baseUrl : 'http://127.0.0.1:' + config.port
};