'use strict';

describe('Header Controller', function() {
	var controller,
	    $location,
	    scope,
	    navs;
	beforeEach(module('myApp', function($provide) {
		return $provide.decorator('FormsIniter', function() {
			return {
				load : function() {
					return [{
						Name : 'Bu',
						Title : 'BU'
					}, {
						Name : 'Cu',
						Title : 'CU'
					}];
				}
			};
		});
	}));
	beforeEach(inject(function($rootScope, $controller, _$location_, _navs_) {
		$location = _$location_;
		navs = _navs_;
		scope = $rootScope.$new();

		controller = $controller('HeaderCtrl', {
			'$scope' : scope
		});
	}));

	it('should get the navs', function() {
		expect(scope.navs[0].controller).toBe('MainCtrl');
	});

	it('should get the tables', function() {
		expect(scope.tables[0].Name).toBe('Bu');
	});
});
