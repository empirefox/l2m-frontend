'use strict';

angularApp.controller('KindeditorsCtrl', ['$scope', 'FormResource', 'toaster', 'EditorCssPath', '$routeParams', '$location',
function($scope, FormResource, toaster, EditorCssPath, $routeParams, $location) {
	$scope.show = function(bucket) {
		var id = '#' + bucket;
		KindEditor.remove(id);
		var editor = KindEditor.create(id, {
			angular : angularApp,
			bucket : bucket,
			cssPath : EditorCssPath
			// fileServer : 'http://127.0.0.1:8080/',
			// baidumapPath : 'http://127.0.0.1:8080/plugins/',
		});
		editor.html('测试内容 ' + bucket);
	};

	$scope.list = function() {
		toaster.pop('wait', $routeParams.fname, "载入中...");
		$scope.pager = $scope.pager || {
			maxSize : 5,
			totalItems : 0,
			itemsPerPage : 20,
			currentPage : 1
		};

		FormResource.names({
			fname : 'Bucket',
			act : 'names',
			size : $scope.pager.itemsPerPage,
			num : $scope.pager.currentPage,
			search : $location.search()
		}, function(data, getResponseHeaders) {
			// data = JSON.parse(JSON.stringify(data, delGoNullTime));
			$scope.buckets = data;
			$scope.pager.totalItems = parseInt(getResponseHeaders('X-Total-Items'));
			$scope.pager.currentPage = parseInt(getResponseHeaders('X-Page'));
			toaster.clear();
			toaster.pop('success', $routeParams.fname, "载入完毕");
		}, function() {
			toaster.clear();
			toaster.pop('error', $routeParams.fname, "载入错误");
		});
	};

	$scope.list();
}]);
