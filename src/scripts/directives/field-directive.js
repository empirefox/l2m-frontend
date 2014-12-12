'use strict';

angularApp.controller('fieldControlCtrl', ['$scope', '$http', '$location', '$routeParams', '$log',
function($scope, $http, $location, $routeParams, $log) {
	var baseDir = '/views/directive-templates/field/';
	// next code-mirror
	var getTemplateUrl = function(type) {
		var templateUrl = '';
		switch(type) {
			case 'number':
			case 'textarea':
			case 'checkbox':
			case 'hidden':
			case 'radio':
			case 'kindeditor':
			case 'parent':
			case 'children':
			case 'timepicker':
			case 'datetimepicker':
				templateUrl = baseDir + type + '.html';
				break;
			case 'datepicker':
			case 'monthpicker':
			case 'yearpicker':
				templateUrl = baseDir + 'datepicker.html';
				break;
			case 'text':
			case 'textfield':
			case 'search':
			case 'url':
			case 'telephone':
			case 'email':
			case 'password':
			//ng额外
			case 'date':
			case 'datetime-local':
			case 'month':
			case 'time':
			case 'week':
				templateUrl = baseDir + 'textfield.html';
				break;
			default:
				templateUrl = baseDir + 'textfield.html';
				$log.warn(type);
		}
		return templateUrl;
	};

	var isDefined = angular.isDefined,
	    isUndefined = angular.isUndefined;

	$scope.field.Type = $scope.field.Type || "text";
	$scope.field.Title = $scope.field.Title || $scope.field.Name;

	$scope.templateUrl = getTemplateUrl($scope.field.Type);
	// ops is dateOptions in datepicker
	// ops is time options container in timepicker
	// ops is time options and dateOptions container in datetimepicker
	$scope.ops = angular.fromJson($scope.field.Ops);

	switch($scope.field.Type) {
		case 'children':
			$scope.view = function() {
				var s = {};
				var pIdKey = S($routeParams.fname).underscore().chompLeft('_').s + "_id";
				s[pIdKey] = $scope.record.Id;
				//以form名称定向
				$location.path('/table/' + pluralize.singular($scope.field.Name)).search(s);
			};
			break;
		case 'parent':
			var parentForm = function() {
				return S($scope.field.Name).chompRight('Id').s;
			};
			$scope.view = function() {
				$location.path('/table/' + parentForm()).search({
					id : $scope.record[$scope.field.Name]
				});
			};
			$scope.$watch('record', function(record, old) {
				var name = $scope.field.Name;
				if (isUndefined($scope.record[name])) {
					delete $scope.parent;
					return;
				}
				if (isDefined($scope.parent) && record[name] === old[name]) {
					return;
				}
				var url = '/' + parentForm() + '/names';
				$http.get(url, {
					params : {
						search : {
							id : record[name]
						}
					}
				}).success(function(idPosNames) {
					if (Array.isArray(idPosNames) && idPosNames.length === 1 && idPosNames[0].Id === record[$scope.field.Name]) {
						$scope.parent = idPosNames[0].Name;
					}
				}).error(function(err) {
					$log.error(err);
				});
			});
			break;
		case 'datetimepicker':
		case 'datepicker':
		case 'timepicker':
			break;
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

}]).directive('fieldControl', ['EditorCssPath', '$log',
function(EditorCssPath, $log) {
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
						$log.log('adjust string to Date')
						record[scope.field.Name] = new Date(data);
						break;
				}
			}
		});
	};

	return {
		template : '<ng-include src="templateUrl"></ng-include>',
		restrict : 'E',
		controller : 'fieldControlCtrl',
		scope : {
			field : '=',
			record : '='
		},
		compile : function(element, attrs, link) {
			return {
				pre : pre
			}
		}
	};
}]);
