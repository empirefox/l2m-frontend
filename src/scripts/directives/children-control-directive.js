'use strict';

angular.module('app.control.children', ['ngRoute', 'app.control.field', 'app.fns']).directive('childrenControl', ['$location', '$routeParams',
function($location, $routeParams) {
	return {
		restrict : 'A',
		controller : function($scope) {
			$scope.view = function() {
				var s = {};
				var pIdKey = S($routeParams.fname).underscore().chompLeft('_').s + "_id";
				s[pIdKey] = $scope.record.Id;
				//以form名称定向
				$location.path('/table/' + pluralize.singular($scope.field.Name)).search(s);
			};
		}
	};
}]);
