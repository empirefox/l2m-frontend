'use strict';

describe('HeaderCtrl', function() {
	var controller,
	    $httpBackend,
	    scope,
	    navs,
	    toaster;

	beforeEach(module('app.header'));
	beforeEach(EqualData);
	beforeEach(inject(httpd()));

	beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _navs_) {
		$httpBackend = _$httpBackend_;
		navs = _navs_;
		scope = $rootScope.$new();
		Msg = jasmine.createSpyObj('Msg', ['loadTablesError']);

		controller = $controller('HeaderCtrl', {
			'$scope' : scope,
			'Msg' : Msg
		});
		$httpBackend.flush();
	}));

	it('should get the navs and HeaderService.active', function() {
		expect(scope.navs[0].controller).toBe('MainCtrl');
		expect(scope.active).toBeDefined();
	});

	it('should get the tables', function() {
		expect(toaster.pop).not.toHaveBeenCalled();
		expect(scope.tables.length).toBe(6);
		expect(scope.tables[0].Name).toBe('Bucket1');
	});
});
