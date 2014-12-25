'use strict';

angular.module('githubs', ['ui.bootstrap', 'ui.bootstrap.datetimepicker', 'angular.filter']);
angular.module('app-filter', ['containsWithPropertyFilter']);
angular.module('app.directives', ['app.form', 'app.control.fields']);
angular.module('app.navs', ['app.header', 'app.navs.tables', 'app.navs.fa', 'app.navs.multiText']);
/* jshint unused: false, -W079 */
var angularApp = angular.module('myApp', ['githubs', 'app-filter', 'app.directives', 'app.navs.const', 'l2m-tpl', 'app.navs']);

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
}]).config(['datepickerConfig', 'datepickerPopupConfig', 'timepickerConfig',
function(datepickerConfig, datepickerPopupConfig, timepickerConfig) {
	datepickerConfig.showWeeks = true;
	datepickerConfig.formatDayTitle = 'yyyy MMMM';
	datepickerPopupConfig.currentText = '今日';
	datepickerPopupConfig.clearText = '清除';
	datepickerPopupConfig.closeText = '关闭';
	timepickerConfig.hourStep = 1;
	timepickerConfig.minuteStep = 15;
	timepickerConfig.showMeridian = true;
}]).run(function() {
});
