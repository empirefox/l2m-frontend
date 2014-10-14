'use strict';

angularApp.controller('HeaderCtrl', ['$scope', 'HeaderService', 'navs',
function($scope, HeaderService, navs) {
	$scope.active = HeaderService.active;
	$scope.navs = navs;
}]);
