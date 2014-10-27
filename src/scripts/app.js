'use strict';

var DEBUG;
if ( typeof DEBUG === 'undefined') {
	DEBUG = true;
}
$(document).on('mouseenter', '.result', function() {
	var doc = document,
	    text = $(this),
	    range,
	    selection;

	if (!text.length) {
		return;
	}

	text = text[0];

	// http://stackoverflow.com/a/987376/1189321
	if (doc.body.createTextRange) {
		range = doc.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();
		range = doc.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);
	}
});
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
Array.prototype.replace = function(val, rep) {
	var index = this.indexOf(val);
	if (index > -1) {
		this[index] = rep;
	}
};

/* jshint unused: false, -W079 */
var angularApp = angular.module('myApp', ['ui.bootstrap', 'l2m-tpl', 'angularBsEditor', 'ngRoute']);

angularApp.constant('editorCssPath', ['{{bootstrap.css}}', '{{font-awesome.css}}'])//kindeditor
.constant('navs', [{
	display : '从这里开始',
	when : '/',
	templateUrl : '/views/main.html',
	controller : 'MainCtrl'
}, {
	//表的管理，url全部为复数表名
	display : 'Bucket',
	when : '/buckets',
	templateUrl : '/views/form-container.html',
	controller : 'BucketsCtrl'
}, {
	display : '测试编辑器',
	when : '/kindeditors',
	templateUrl : '/views/test-with-editor.html',
	controller : 'KindeditorsCtrl'
}, {
	display : '多行文本转变量',
	when : '/strings',
	templateUrl : '/views/multitext.html',
	controller : 'MultiTextCtrl'
}, {
	display : 'Fa列表',
	when : '/fas',
	templateUrl : '/views/fa-list.html',
	controller : 'FaListCtrl'
}]).config(['$routeProvider', 'navs',
function($routeProvider, navs) {
	angular.forEach(navs, function(nav) {
		$routeProvider.when(nav.when, nav);
	});
	$routeProvider.when('/table/:fname', {
		templateUrl : '/views/form-container.html',
		controller : 'TablesCtrl'
	});
	$routeProvider.otherwise({
		redirectTo : '/'
	});
}]).factory('FormsIniter', ['$http',
function($http) {
	return {
		load : function() {
			return $http.get('/forms').then(function(response) {
				var data = response.data;
				if (!data.error) {
					return data.content;
				}
				return [];
			});
		}
	};
}]).run(['$rootScope', 'FormsIniter',
function($rootScope, FormsIniter) {
	FormsIniter.load().then(function(data) {
		$rootScope.tables = data;
	});
}]);

