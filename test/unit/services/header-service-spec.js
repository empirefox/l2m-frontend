'use strict';

describe('Header Service', function() {
	var $rootScope,
	    $location,
	    service,
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
	beforeEach(inject(function(HeaderService, _$rootScope_, _$location_, _navs_) {
		service = HeaderService;
		$rootScope = _$rootScope_;
		$location = _$location_;
		navs = _navs_;
	}));

	it('should acitve nav work', function() {
		$location.path('/buckets');
		expect(service.active(navs[1]).active).toBe(true);
		expect(service.active(navs[3]).active).toBe(false);

		$location.path('/strings');
		expect(service.active(navs[1]).active).toBe(false);
		expect(service.active(navs[3]).active).toBe(true);
	});

	it('should acitve tables work', function() {
		$location.path('/table/Bu');
		expect(service.active({
			Name : 'Bu',
			Title : 'BU'
		}).active).toBe(true);
		expect(service.active({
			Name : 'Cu',
			Title : 'CU'
		}).active).toBe(false);

		$location.path('/table/Cu');
		expect(service.active({
			Name : 'Bu',
			Title : 'BU'
		}).active).toBe(false);
		expect(service.active({
			Name : 'Cu',
			Title : 'CU'
		}).active).toBe(true);
	});
})
