angular.module('containsWithPropertyFilter', ['app.fns']).filter('containsWithProperty', ['ArrFn',
function(ArrFn) {
	return ArrFn.containsWithProperty;
}]);
