'use strict';

angularApp.controller('FaListCtrl', ['$scope', '$http',
function($scope, $http) {
	var ops = {
		url : 'http://cdn.staticfile.org/font-awesome/4.2.0/css/font-awesome.css'
	};
	$http.get(ops.url).success(function(data) {
		var fas = data.match(/.fa-.*:before/gi);
		angular.forEach(fas, function(val, key) {
			fas[key] = val.substring('.fa-'.length, val.length - ':before'.length);
		});
		$scope.fas = fas;
	});
}]);
