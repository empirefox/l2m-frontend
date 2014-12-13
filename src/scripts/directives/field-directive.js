'use strict';

angular.module('app.control.field', ['ui.bootstrap', 'app.control.children', 'app.control.parent', 'app.control.datepicker', 'app.fns']);
angular.module('app.control.field').controller('fieldControlCtrl', ['$scope', 'TplFn',
function($scope, TplFn) {
	$scope.field.Type = $scope.field.Type || "text";
	$scope.field.Title = $scope.field.Title || $scope.field.Name;
	$scope.ops = angular.fromJson($scope.field.Ops);
	$scope.templateUrl = TplFn.field($scope.field.Type);
}]).directive('fieldControl', ['$log',
function($log) {
	var pre = function(scope) {
		scope.$watch('record', function(record) {
			var data = record[scope.field.Name];
			if ( typeof data === 'string') {
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
						record[scope.field.Name] = new Date(data);
						break;
				}
			}
		});
	};

	return {
		template : '<ng-include src="templateUrl"></ng-include>',
		restrict : 'E',
		replace : true,
		controller : 'fieldControlCtrl',
		scope : {
			field : '=',
			record : '='
		},
		link : {
			pre : pre
		}
	};
}]);
