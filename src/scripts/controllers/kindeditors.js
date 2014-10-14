'use strict';

angularApp.controller('KindeditorsCtrl', ['$scope', '$http', 'editorCssPath',
function($scope, $http, editorCssPath) {
	$scope.show = function(bucket) {
		var id = '#' + bucket;
		KindEditor.remove(id);
		var editor = KindEditor.create(id, {
			angular : angularApp,
			bucket : bucket,
			cssPath : editorCssPath,
			// fileServer : 'http://127.0.0.1:8080/',
			// baidumapPath : 'http://127.0.0.1:8080/plugins/',
		});
		editor.html('测试内容 ' + bucket);
	};

	$http.get('/bucket/names').success(function(data) {
		$scope.buckets = data.content;
		$scope.alert = {
			type : 'success',
			msg : '载入完毕'
		};
	});
}]);
