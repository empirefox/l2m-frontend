'use strict';

describe('CpsService', function() {
	var list,
	    record,
	    service,
	    Cps,
	    $location;

	var fname = 'Field';
	beforeEach(module('cps-service'));
	beforeEach(inject(function($routeParams, _$location_, CpsService, _Cps_) {
		$routeParams.fname = fname;
		service = CpsService;
		$location = _$location_;
		Cps = _Cps_;

		list = [{
			Name : 'name1',
			Pos : 30
		}, {
			Name : 'name2',
			Pos : 10
		}, {
			Name : 'name3',
			Pos : 1
		}];

		record = {
			Name : 'nameR',
			Pos : 11,
			FormId : 2
		};
	}));

	it('should get Cp', function() {
		expect(service.get()).toBe(Cps[fname]);
	});

	describe('averagePos', function() {

		it('should not mod list, but shoud return true', function() {
			var l = list.slice(0, 2);
			expect(service.averagePos(l)).toBe(true);
			expect(l).toEqual(list.slice(0, 2));
		});

		it('should rebuild pos from bottom with no limit', function() {
			expect(service.averagePos(list, 1, -1)).toBe(true);
			expect(list).toEqual([{
				Name : 'name1',
				Pos : 17
			}, {
				Name : 'name2',
				Pos : 9
			}, {
				Name : 'name3',
				Pos : 1
			}]);
		});

		it('should average the pos', function() {
			expect(service.averagePos(list, 1, 31)).toBe(true);
			expect(list).toEqual([{
				Name : 'name1',
				Pos : 31
			}, {
				Name : 'name2',
				Pos : 16
			}, {
				Name : 'name3',
				Pos : 1
			}]);
		});
	});

	describe('pSearch', function() {

		it('should gen search json', function() {
			expect(service.pSearch(record)).toEqual({
				'form_id' : 2
			});
		});

		it('should not gen search json', function() {
			expect(service.pSearch(list[0])).toBeUndefined();
		});
	});

	describe('canSetPos', function() {
		var search;
		beforeEach(function() {
			spyOn($location, 'search').and.callFake(function() {
				return search;
			});
		});

		it('should return false', function() {
			search = {};
			expect(service.canSetPos()).toBe(false);

			search = {
				'form_id' : 90,
				'other' : 90
			};
			expect(service.canSetPos()).toBe(false);
		});

		it('should return true', function() {
			search = {
				'form_id' : 90
			};
			expect(service.canSetPos()).toBe(true);
		});
	});

	describe('newPosUpTo', function() {
		var search = {
			'form_id' : 90
		};
		beforeEach(function() {
			spyOn($location, 'search').and.callFake(function() {
				return search;
			});
		});

		it('should get new pos normal', function() {
			expect(service.newPosUpTo(list, 10)).toEqual(20);
		});
	});
});
