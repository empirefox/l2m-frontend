'use strict';

angular.module('app.control.parent', ['app.control.field']).directive('parentControl', ['$http', '$location', '$log',
function($http, $location, $log) {
	return {
		restrict : 'A',
		controller : function($scope) {
			var isDefined = angular.isDefined,
			    isUndefined = angular.isUndefined;

			var parentForm = function() {
			    // ParentId => Parent
				return S($scope.field.Name).chompRight('Id').s;
			};
			$scope.view = function() {
			    // Redirect to: /table/Parent?id=1
				$location.path('/table/' + parentForm()).search({
					id : $scope.record[$scope.field.Name]
				});
			};
			// record changed > change the record's parent display name
			$scope.$watch('record', function(record, old) {
				var name = $scope.field.Name;
				if (isUndefined($scope.record[name])) {
				    // no record now > delete
				    // parentName: Parent
					delete $scope.parentName;
					return;
				}
				if (isDefined($scope.parentName) && record[name] === old[name]) {
					return;
				}
				var url = '/' + parentForm() + '/names';
				// Get /Parent/names?id=123
				$http.get(url, {
					params : {
						search : {
							id : record[name]
						}
					}
				}).success(function(idPosNames) {
					if (Array.isArray(idPosNames) && idPosNames.length === 1 && idPosNames[0].Id === record[$scope.field.Name]) {
						$scope.parentName = idPosNames[0].Name;
					}
				}).error(function(err) {
					$log.error(err);
				});
			});
		}
	};
}]);
