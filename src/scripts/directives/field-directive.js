'use strict';

angular.module('app.control.field', ['ngRoute', 'ui.bootstrap', 'app.fns']);
angular.module('app.control.field').directive('fieldControl', ['TplFn',
function(TplFn) {
	var pre = function(scope) {
		scope.$watch('record', function(record) {
			if (record && scope.field.Name && typeof record[scope.field.Name] === 'string') {
				switch(scope.field.Type) {
					case 'datetime-local':
					case 'month':
					case 'week':
					case 'time':
					case 'timepicker':
					case 'date':
					case 'datepicker':
					case 'monthpicker':
					case 'yearpicker':
					case 'datetimepicker':
						record[scope.field.Name] = new Date(record[scope.field.Name]);
						break;
				}
			}
		});
	};

	return {
		template : '<ng-include src="url"></ng-include>',
		restrict : 'E',
		controller : function($scope) {
			$scope.field.Type = $scope.field.Type || "text";
			$scope.field.Title = $scope.field.Title || $scope.field.Name;
			$scope.ops = angular.fromJson($scope.field.Ops);
			$scope.url = TplFn.field($scope.field.Type);
		},
		scope : {
			field : '=',
			record : '='
		},
		link : {
			pre : pre
		}
	};
}]);
