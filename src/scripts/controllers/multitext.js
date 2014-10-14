'use strict';

angularApp.controller('MultiTextCtrl', ['$scope',
function($scope) {
	$scope.arg = "a";
	$scope.compute = function() {
		var left = $scope.arg + "+='";
		var right = "';\n";
		var connection = right + left;
		var raw = $scope.code.replace(/'/g, "\\'");
		$scope.out = "var " + $scope.arg + "='" + raw.replace(/[\n\r]+/g, connection) + right;
	};
}]);
