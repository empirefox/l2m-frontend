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
				// self fname|Parent| => child field|parent_id|
				// Redirect to: /table/Child?parent_id=1
				$location.path('/table/' + pluralize.singular($scope.field.Name)).search(s);
			};
		}
	};
}]);
