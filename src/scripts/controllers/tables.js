'use strict';

angularApp.controller('TablesCtrl', ['$scope', '$routeParams', 'FormService',
function($scope, $routeParams, FormService) {
	var fname = $routeParams.fname;
	var table = function(target) {
		return '/' + fname + '/' + target;
	};
	$scope.ops = {
		load : table('page'),
		save : table('binding/save'),
		remove : table('binding/remove'),
		recovery : table('recovery'),
		migrate : table('migrate'),
		formName : fname
	};
	FormService.get(table('form')).then(function(form) {
		$scope.form = form;
	});
}]);
