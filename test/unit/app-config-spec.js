'use strict';

describe('angular app', function() {
	var $location,
	    $rootScope,
	    $route;
	beforeEach(module('myApp'));
	beforeEach(inject(function($q, _$rootScope_, _$location_, _$route_) {
		$rootScope = _$rootScope_;
		$location = _$location_;
		$route = _$route_;
	}));

	describe('$routeProvider', function() {
		it('should route static path', function() {
			expect($route.current).toBeUndefined();
			$location.path('/strings');
			$rootScope.$digest();

			expect($route.current).toEqual(jasmine.objectContaining({
				templateUrl : '/views/multitext.html',
				controller : 'MultiTextCtrl'
			}));

			$location.path('/otherwise');
			$rootScope.$digest();

			expect($route.current).toEqual(jasmine.objectContaining({
				templateUrl : '/views/main.html',
				controller : 'MainCtrl'
			}));
		});

		it('should route dynamic path', function() {
			expect($route.current).toBeUndefined();
			$location.path('/table/Bucket');
			$rootScope.$digest();

			expect($route.current).toEqual(jasmine.objectContaining({
				templateUrl : '/views/tables.html',
				controller : 'TablesCtrl'
			}));
		});
	});
})
