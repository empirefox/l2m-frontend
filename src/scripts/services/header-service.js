'use strict';

angularApp.service('HeaderService', ['$location',
function($location) {
	return {
		active : function(nav) {
			var path = $location.path();
			return {
				active : path === nav.when || path === ('/table/' + nav.Name)
			};
		}
	};
}]);
