'use strict';

angularApp.service('FormService', ['$http',
function($http) {
	this.get = function(formPath) {
		return $http.get(formPath).then(function(response) {
			return response.data;
		});
	};
}]);
