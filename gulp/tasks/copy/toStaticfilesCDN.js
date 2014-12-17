var replace = require('gulp-replace');

module.exports = function() {
	return replace(/\/\/cdnjs\.cloudflare\.com\/ajax\/libs/g, '//cdn.staticfile.org');
};
