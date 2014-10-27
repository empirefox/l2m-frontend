'use strict';

angularApp.directive('fieldDirective', ['$http', '$compile', '$location', '$routeParams', 'editorCssPath', '$templateCache',
function($http, $compile, $location, $routeParams, editorCssPath, $templateCache) {
	var placeholders = {
		search : "关键字",
		url : "如：http://www.luck2.me",
		telephone : "如：18688888888",
		email : "Email",
		password : "输入密码",
	};

	var baseDir = '/views/directive-templates/field/';

	var getTemplateUrl = function(type) {
		var templateUrl = '';
		switch(type) {
			case 'number':
			case 'textarea':
			case 'checkbox':
			case 'date':
			case 'dropdown':
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
			case 'dateTimeLocal':
			case 'month':
			case 'time':
			case 'week':
				templateUrl = baseDir + 'textfield.html';
				break;
			default:
				templateUrl = baseDir + 'textfield.html';
				console.log(type);
		}
		return templateUrl;
	};
	var getValue = function(scope) {
		return scope.data[scope.field.Name] || "";
	};
	var deleteValue = function(scope) {
		delete scope.data[scope.field.Name];
	};
	var initers = {
		kindeditor : function(scope, element) {
			var initValue = getValue(scope);
			var ops = {
				width : "100%",
				angular : angularApp,
				allowImageUpload : true,
				allowFileManager : true,
				cssPath : editorCssPath,
				afterChange : function() {
					var self = this;
					self.sync();
					var fn = function() {
						var content = self.html();
						if ("" === content) {
							deleteValue(scope);
						} else {
							scope.data[scope.field.Name] = content;
						}
					};
					if (angular.isDefined(scope.data)) {
						(scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
					}
				},
				afterCreate : function() {
					this.html(initValue);
				}
			};
			var ke = KindEditor.create(element.find("textarea")[0], angular.extend(ops, JSON.parse(scope.field.Ops)));

			/*jshint unused:false */
			scope.$watch('data', function(value) {
				if (angular.isDefined(scope.data)) {
					ke.html(getValue(scope));
				}
			});
		},
		/*jshint unused:false */
		children : function(scope, element) {
			scope.view = function() {
				var single = pluralize.singular(scope.field.Name);
				var s = {};
				var pIdKey = S($routeParams.fname).underscore().chompLeft('_').s + "_id";
				s[pIdKey] = scope.data.Id;
				//以form名称定向
				$location.path('/table/' + single).search(s);
			};
		},
		/*jshint unused:false */
		parent : function(scope, element) {
			var getPform = function() {
				return S(scope.field.Name).chompRight('Id').s;
			};
			var getPid = function(data) {
				return data[scope.field.Name];
			};
			scope.view = function() {
				$location.path('/table/' + getPform()).search({
					id : getPid(scope.data)
				});
			};

			scope.$watch('data', function(newValue, oldValue) {
				var pid = getPid(newValue);
				if (angular.isUndefined(pid)) {
					delete scope.parent;
					return;
				}
				if (angular.isDefined(scope.parent) && pid === getPid(oldValue)) {
					return;
				}
				var url = '/' + getPform() + '/names';
				$http.get(url, {
					params : {
						search : JSON.stringify({
							id : pid
						})
					}
				}).success(function(data) {
					if (data.error) {
						return;
					}
					var idPosNames = data.content.list;
					console.log(idPosNames);
					if (idPosNames[0].Id === pid) {
						scope.parent = idPosNames[0].Name;
						return;
					}
					console.log('返回多个值');
				});
			});
		}
	};

	var linker = function(scope, element) {
		var name = scope.field.Name,
		    type = scope.field.Type;
		// GET template content from path
		if (!scope.field.Title) {
			scope.field.Title = name;
		}
		if (!type) {
			type = "text";
		}
		if (angular.isDefined(placeholders[type]) && angular.isUndefined(scope.field.Placeholder)) {
			scope.field.Placeholder = placeholders[type];
		}

		var resolveTpl = function(tpl) {
			element.html(tpl);
			$compile(element.contents())(scope);
			var initer = initers[type];
			if (initer) {
				initer(scope, element);
			}
		};
		var templateUrl = getTemplateUrl(type);
		var tpl = $templateCache.get(templateUrl);
		if (tpl) {
			resolveTpl(tpl);
		} else {
			$http.get(templateUrl).success(resolveTpl).error(function(tpl) {
				console.log('fieldDirective linker ' + tpl + ' with url:' + templateUrl);
			});
		}
	};

	return {
		template : '<div>{{}}</div>',
		restrict : 'E',
		scope : {
			field : '=',
			data : '=record'
		},
		link : linker
	};
}]);
