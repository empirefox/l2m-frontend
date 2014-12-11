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
			case 'date':
			case 'datetimepicker':
			case 'hidden':
			case 'radio':
			case 'kindeditor':
			case 'parent':
			case 'children':
				templateUrl = baseDir + type + '.html';
				break;
			case 'text':
			case 'textfield':
			case 'search':
			case 'url':
			case 'telephone':
			case 'email':
			case 'password':
			//ng额外
			// case 'datetime-local':
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
	    isUndefined = angular.isUndefined,

	    data,
	    field,
	    name,
	    type;

	$scope.$watch('record', function(record, old) {
		field = $scope.field,
		name = field.Name,
		type = field.Type || "text",
		data = $scope.data = record[name];

		field.Title = field.Title || name;

		$scope.templateUrl = getTemplateUrl(type);

		switch(type) {
			case 'children':
				$scope.view = function() {
					var s = {};
					var pIdKey = S($routeParams.fname).underscore().chompLeft('_').s + "_id";
					s[pIdKey] = record.Id;
					//以form名称定向
					$location.path('/table/' + pluralize.singular(name)).search(s);
				};
				break;
			case 'parent':
				if (isUndefined(data)) {
					delete $scope.parent;
					break;
				}
				var parentForm = S(name).chompRight('Id').s;
				$scope.view = function() {
					$location.path('/table/' + parentForm).search({
						id : data
					});
				};

				if (isDefined($scope.parent) && data === old[name]) {
					return;
				}
				var url = '/' + parentForm + '/names';
				$http.get(url, {
					params : {
						search : {
							id : data
						}
					}
				}).success(function(idPosNames) {
					if (Array.isArray(idPosNames) && idPosNames.length === 1 && idPosNames[0].Id === data) {
						$scope.parent = idPosNames[0].Name;
					}
				}).error(function(err) {
					$log.error(err);
				});
				break;
			case 'datetimepicker':
				var ops = {
					minDate : null,
					maxDate : null,
					showWeeks : true,
					hourStep : 1,
					minuteStep : 5,
					showMeridian : true,
					dayTitleFormat : 'yyyy MMMM',
					readonlyTime : false
				};
				$scope.ops = angular.extend(ops, angular.fromJson(field.Ops));
				break;
		}
	});

}]).directive('fieldControl', ['EditorCssPath',
function(EditorCssPath) {
	var getValue = function(scope) {
		return scope.record[scope.field.Name] || "";
	};
	var deleteValue = function(scope) {
		delete scope.record[scope.field.Name];
	};
	var linker = function(scope, element) {
		var type = scope.field.Type;
		switch(type) {
			case 'kindeditor':
				var initValue = getValue(scope);
				var ops = {
					width : "100%",
					angular : angularApp,
					allowImageUpload : true,
					allowFileManager : true,
					cssPath : EditorCssPath,
					afterChange : function() {
						var self = this;
						self.sync();
						var fn = function() {
							var content = self.html();
							if ("" === content) {
								deleteValue(scope);
							} else {
								scope.record[scope.field.Name] = content;
							}
						};
						if (angular.isDefined(scope.record)) {
							(scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
						}
					},
					afterCreate : function() {
						this.html(initValue);
					}
				};
				var ke = KindEditor.create(element.find("textarea")[0], angular.extend(ops, angular.fromJson(field.Ops)));

				/*jshint unused:false */
				scope.$watch('record', function(value) {
					if (angular.isDefined(scope.record)) {
						ke.html(getValue(scope));
					}
				});
		}
	};

	return {
		template : '<ng-include src="templateUrl"></ng-include>',
		restrict : 'E',
		controller : 'fieldControlCtrl',
		scope : {
			field : '=',
			record : '='
		},
		link : linker
	};
}]);
