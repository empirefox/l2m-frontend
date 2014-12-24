var config = require('./gulp/config.js');

exports.config = {
	//	directConnect : true,

	seleniumServerJar : './node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',

	seleniumPort : 4444,

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