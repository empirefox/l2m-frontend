'use strict';

describe('TablesCtrl', function() {
	var controller,
	    scope;

	beforeEach(module('app.navs.tables'));
	beforeEach(module('l2m-tpl'));
	beforeEach(EqualData);
	beforeEach(inject(httpd()));

	beforeEach(inject(function($rootScope, $controller, $httpBackend) {
		scope = $rootScope.$new();

		controller = $controller('TablesCtrl', {
			$scope : scope
		});
	}));

	it('should init ok', function() {
		expect(scope.ops).toEqualData({});
	});
});
