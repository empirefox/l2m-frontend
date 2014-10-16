'use strict';

describe('angular app', function() {
	var $location,
	    $rootScope,
	    $route,
	    $httpBackend;
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
	beforeEach(inject(function(_$rootScope_, _$location_, _$route_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		$location = _$location_;
		$route = _$route_;
		$httpBackend = _$httpBackend_;
	}));

	describe('$routeProvider', function() {
		it('should route static path', function() {
			expect($route.current).toBeUndefined();
			$location.path('/buckets');
			$rootScope.$digest();

			expect($route.current).toEqual(jasmine.objectContaining({
				templateUrl : 'views/form-container.html',
				controller : 'BucketsCtrl'
			}));

			$location.path('/otherwise');
			$rootScope.$digest();

			expect($route.current).toEqual(jasmine.objectContaining({
				templateUrl : 'views/main.html',
				controller : 'MainCtrl'
			}));
		});

		it('should route dynamic path', function() {
			expect($route.current).toBeUndefined();
			$location.path('/table/Bucket');
			$rootScope.$digest();

			expect($route.current).toEqual(jasmine.objectContaining({
				templateUrl : 'views/form-container.html',
				controller : 'TablesCtrl'
			}));
		});
	});

	describe('$rootScope', function() {
		it('should get TableForms from server', function() {
			expect($rootScope.tables[0]).toEqual(jasmine.objectContaining({
				Name : 'Bu',
				Title : 'BU'
			}));
		});
	});
})
