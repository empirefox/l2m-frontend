'use strict';

angularApp.directive('fieldDirective', ['$http', '$compile', '$location', 'editorCssPath', 'ParentsSession', '$templateCache',
function($http, $compile, $location, editorCssPath, ParentsSession, $templateCache) {
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
			scope.view = function(plural) {
				var single = pluralize.singular(plural);
				//将当前记录传递到子列表中
				ParentsSession[single] = scope.data;
				console.log(single);
				console.log(ParentsSession);
				//以form名称定向
				$location.path('/table/' + single);
			};
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
