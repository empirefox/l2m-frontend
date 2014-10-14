'use strict';

angularApp.controller('GooglesCtrl', ['$scope', 'FormService',
function($scope, FormService) {
	$scope.ops = {
		load : '/google/page',
		save : '/google/save',
		remove : '/google/remove',
		recovery : '/google/recovery',
		migrate : '/google/migrate',
		form : '/google/form'
	};
	FormService.get($scope.ops.form).then(function(form) {
		$scope.form = form;
	});
}]);
