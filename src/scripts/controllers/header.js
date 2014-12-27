'use strict';

angular.module('app.header.service', []).service('HeaderService', ['$location',
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

angular.module('app.header', ['app.data.tables', 'app.header.service', 'app.navs.const'])
// HeaderCtrl
.controller('HeaderCtrl', ['$scope', 'TablesService', 'HeaderService', 'navs',
function($scope, TablesService, HeaderService, navs) {
	$scope.active = HeaderService.active;
	$scope.navs = navs;
	$scope.ts = TablesService;
}]);
