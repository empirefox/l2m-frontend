'use strict';

angularApp.controller('BucketsCtrl', ['$scope', 'FormService',
function($scope, FormService) {
	$scope.ops = {
		load : '/Bucket/page',
		save : '/Bucket/save',
		remove : '/Bucket/remove',
		recovery : '/Bucket/recovery',
		migrate : '/Bucket/migrate',
		form : '/Bucket/form'
	};
	FormService.get($scope.ops.form).then(function(form) {
		$scope.form = form;
	});
}]);
