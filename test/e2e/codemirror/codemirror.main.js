angular.module('protractorApp', ['app.control.codemirror']).controller('Ctrl', function($scope) {
	$scope.field = {
		Name : 'CodeMirror',
		Type : 'codemirror',
		Required : true
	};
	$scope.editing = {};
});
