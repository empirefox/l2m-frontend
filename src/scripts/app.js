'use strict';

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

angular.module('githubs', ['ui.bootstrap', 'ngRoute', 'ngResource', 'toaster', 'dialogs.main', 'pascalprecht.translate', 'angular.filter']);
angular.module('app-filter', ['containsWithPropertyFilter']);
/* jshint unused: false, -W079 */
var angularApp = angular.module('myApp', ['githubs', 'navs-const', 'app.fns', 'cps-service', 'l2m-tpl', 'bs-ng-editor', 'formServices', 'msg', 'app-filter']);

angularApp.config(['$routeProvider', 'navs',
function($routeProvider, navs) {
	angular.forEach(navs, function(nav) {
		$routeProvider.when(nav.when, nav);
	});
	$routeProvider.when('/table/:fname', {
		templateUrl : '/views/tables.html',
		controller : 'TablesCtrl'
	});
	$routeProvider.otherwise({
		redirectTo : '/'
	});
}]).config(['$tooltipProvider',
function($tooltipProvider) {
	$tooltipProvider.options({
		placement : 'top',
		animation : false,
		popupDelay : 0,
		appendToBody : true
	});
}]).config(['dialogsProvider', '$translateProvider',
function(dialogsProvider, $translateProvider) {
	dialogsProvider.useBackdrop('static');
	dialogsProvider.useEscClose(false);
	dialogsProvider.useCopy(false);
	dialogsProvider.setSize('sm');

	$translateProvider.translations('zh-CN', {
		DIALOGS_ERROR : "错误",
		DIALOGS_ERROR_MSG : "发生未知错误.",
		DIALOGS_CLOSE : "关闭",
		DIALOGS_PLEASE_WAIT : "请稍等",
		DIALOGS_PLEASE_WAIT_ELIPS : "请稍等...",
		DIALOGS_PLEASE_WAIT_MSG : "等待操作结束.",
		DIALOGS_PERCENT_COMPLETE : "已完成 %",
		DIALOGS_NOTIFICATION : "通知",
		DIALOGS_NOTIFICATION_MSG : "未知程序通知.",
		DIALOGS_CONFIRMATION : "请确认",
		DIALOGS_CONFIRMATION_MSG : "确认进行.",
		DIALOGS_OK : "确定",
		DIALOGS_YES : "确认",
		DIALOGS_NO : "取消"
	});

	$translateProvider.preferredLanguage('zh-CN');
}]).run(function() {
});
