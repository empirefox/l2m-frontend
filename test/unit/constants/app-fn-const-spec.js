'use strict';

describe('app.fns', function() {
	var ArrFn,
	    PosFn,
	    JsonFn;

	beforeEach(module('app.fns'));
	beforeEach(inject(function(_ArrFn_, _PosFn_, _JsonFn_) {
		ArrFn = _ArrFn_;
		PosFn = _PosFn_;
		JsonFn = _JsonFn_;
	}));

	describe('ArrFn', function() {
		var container = [{
			Name : 'n1',
			Pos : 1
		}, {
			Name : 'n2',
			Pos : 2
		}, {
			Name : 'n3',
			Pos : 3
		}];

		describe('equals', function() {
			it('should return true', function() {
				var a1 = 'a,b,c'.split(',');
				var a2 = 'b,a,c'.split(',');
				expect(ArrFn.equals(a1, a2)).toBe(true);
			});

			it('should return false', function() {
				var a1 = 'a,b,c'.split(',');
				var a2 = 'a,c'.split(',');
				expect(ArrFn.equals(a1, a2)).toBe(false);

				a2 = 'a,c,d'.split(',');
				expect(ArrFn.equals(a1, a2)).toBe(false);
			});
		});

		it('should findIndexByPos', function() {
			expect(ArrFn.findIndexByPos(container, 1)).toBe(0);
			expect(ArrFn.findIndexByPos(container, 2)).toBe(1);
			expect(ArrFn.findIndexByPos(container, 3)).toBe(2);
		});

		it('should not findIndexByPos', function() {
			expect(ArrFn.findIndexByPos(container, 5)).toBe(-2);
		});

		it('should containsWithProperty with Pos', function() {
			var target1 = {
				Name : 'n6',
				Pos : 2
			};
			expect(ArrFn.containsWithProperty(container, target1, 'Pos')).toBe(true);
		});

		it('should not containsWithProperty with Pos', function() {
			var target2 = {
				Name : 'n6',
				Pos : 6
			};
			expect(ArrFn.containsWithProperty(container, target2, 'Pos')).toBe(false);
		});

		it('should contains with name', function() {
			var target1 = {
				Name : 'n2',
				Pos : 6
			};
			expect(ArrFn.containsName(container, target1)).toBe(true);
		});

		it('should not contains with name', function() {
			var target2 = {
				Name : 'n6',
				Pos : 2
			};
			expect(ArrFn.containsName(container, target2)).toBe(false);
		});

		it('should diff name form other array', function() {
			var from = [{
				Name : 'n1',
				Pos : 1
			}, {
				Name : 'n6',
				Pos : 2
			}];
			expect(ArrFn.diffName(container, from)).toEqual([{
				Name : 'n2',
				Pos : 2
			}, {
				Name : 'n3',
				Pos : 3
			}]);
		});

		it('should intersect name form other array', function() {
			var from = [{
				Name : 'n1',
				Pos : 1
			}, {
				Name : 'n6',
				Pos : 2
			}];
			expect(ArrFn.intersectName(container, from)).toEqual([{
				Name : 'n1',
				Pos : 1
			}]);
		});

	});

	describe('PosFn', function() {
		it('should order with pos desc', function() {
			var container = [{
				Name : 'n1',
				Pos : 1
			}, {
				Name : 'n6',
				Pos : 2
			}];
			var after = container.sort(PosFn.desc)
			expect(after).toEqual([{
				Name : 'n6',
				Pos : 2
			}, {
				Name : 'n1',
				Pos : 1
			}]);
			expect(container).toEqual(after);
		});

		it('should know it is ips', function() {
			expect(PosFn.isIps([{
				Id : 'n6',
				Pos : 2
			}, {
				Id : 'n1',
				Pos : 1
			}])).toBe(true);
		});

		it('should know it is not ips', function() {
			expect(PosFn.isIps([{
				Id : 'n6',
				Pos : 2,
				Name : 'a'
			}, {
				Id : 'n1',
				Pos : 1,
				Name : 'a'
			}])).toBe(false);

			expect(PosFn.isIps([{
				Name : 'n6',
				Pos : 2
			}, {
				Name : 'n1',
				Pos : 1
			}])).toBe(false);

			expect(PosFn.isIps({
				Id : 'n6',
				Pos : 2
			})).toBe(false);

			expect(PosFn.isIps([])).toBe(false);
		});

		it('should create new ip', function() {
			expect(PosFn.newIp({
				Id : 'n6',
				Pos : 2
			})).toEqual({
				Id : 'n6',
				Pos : 2
			});

			expect(PosFn.newIp({
				Id : 'n6',
				Pos : 2,
				Name : 'name'
			})).toEqual({
				Id : 'n6',
				Pos : 2
			});
		});

		it('should exchange pos', function() {
			var ip1 = {
				Id : 'n1',
				Pos : 1
			},
			    ip2 = {
				Id : 'n2',
				Pos : 2
			};
			PosFn.xpos(ip1, ip2);
			expect(ip1).toEqual({
				Id : 'n1',
				Pos : 2
			});
			expect(ip2).toEqual({
				Id : 'n2',
				Pos : 1
			});
		});
	});

	describe('JsonFn', function() {
		it('should delete non example attributes', function() {
			var obj = {
				Id : 1,
				Pos : 1,
				Name : 'name'
			};
			expect(JsonFn.filterExample(obj)).toEqual({
				Name : 'name'
			});
		});
	});
});
