'use strict';

//used for app.js FormsIniter spy
var FormsIniterInjector = function($provide) {
	return $provide.decorator('FormsIniter', function() {
		return {
			load : function() {
				return {
					then : function(callback) {
						callback([{
							Name : 'Bu',
							Title : 'BU'
						}, {
							Name : 'Cu',
							Title : 'CU'
						}]);
					}
				};
			}
		};
	});
};