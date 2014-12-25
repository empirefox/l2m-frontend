'use strict';

angular.module('app.navs.fa', ['app.text.select']).controller('FaListCtrl', ['$scope', '$http',
function($scope, $http) {
	$scope.url = '//cdn.staticfile.org/font-awesome/4.2.0/css/font-awesome.css';
	$scope.getList = function() {
		$http.get($scope.url).success(function(data) {
			var fas = data.match(/.fa-.*:before/gi);
			angular.forEach(fas, function(val, key) {
				fas[key] = val.substring('.fa-'.length, val.length - ':before'.length);
			});
			$scope.fas = fas;
		});
	};
}]);
