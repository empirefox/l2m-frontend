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

angular.module('app.header', ['app.header.service', 'app.form.service', 'app.navs.const', 'app.msg'])
// HeaderCtrl
.controller('HeaderCtrl', ['$scope', 'FormResource', 'HeaderService', 'navs', 'Msg',
function($scope, FormResource, HeaderService, navs, Msg) {
	$scope.active = HeaderService.active;
	$scope.navs = navs;
	FormResource.forms(function(data) {
		$scope.tables = data;
	}, function() {
		Msg.loadTablesError();
	});
}]);
