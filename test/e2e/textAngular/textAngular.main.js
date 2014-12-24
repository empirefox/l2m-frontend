angular.module('protractorApp', ['app.control.textAngular']).controller('textAngularCtrl', function($scope) {
	$scope.field = {
		Name : 'TaEditor',
		Type : 'text-angular',
		Required : true,
		Placeholder : 'new content here'
	};
	$scope.editing = {};
});
