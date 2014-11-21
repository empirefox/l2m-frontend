'use strict';

angularApp.controller('HeaderCtrl', ['$scope', 'FormResource', 'HeaderService', 'navs', 'toaster',
function($scope, FormResource, HeaderService, navs, toaster) {
	$scope.active = HeaderService.active;
	$scope.navs = navs;
	FormResource.forms(function(data) {
		$scope.tables = data;
	}, function(error) {
		console.log(error);
		toaster.clear();
		toaster.pop('error', null, '服务器加载tables错误');
	});
}]);
