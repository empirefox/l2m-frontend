'use strict';

angular.module('app.control.datepicker', ['ui.bootstrap.datepicker']).directive('datepickerControl', function() {
	return {
		restrict : 'A',
		controller : function($scope) {
			// ops is dateOptions in datepicker
			// ops is time options container in timepicker
			// ops is time options and dateOptions container in datetimepicker
			switch($scope.field.Type) {
				case 'monthpicker':
					angular.extend($scope.ops, {
						minMode : 'month',
						datepickerMode : "'month'"
					});
					$scope.formate = 'yyyy-MM';
					break;
				case 'yearpicker':
					angular.extend($scope.ops, {
						minMode : 'year',
						datepickerMode : "'year'"
					});
					$scope.formate = 'yyyy';
					break;
			}
		}
	};
});
