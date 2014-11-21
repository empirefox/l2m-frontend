'use strict';

describe('containsWithPropertyFilter', function() {
	var list,
	    filter;
	beforeEach(module('containsWithPropertyFilter'));
	beforeEach(inject(function($filter) {
		filter = $filter('containsWithProperty');
	}));

	list = [{
		Name : 'name1'
	}, {
		Name : 'name2'
	}, {
		Name : 'name3'
	}];

	it('should contains with Name', function() {
		expect(filter(list, {
			Name : 'name1'
		})).toBe(false);

		expect(filter(list, {
			Name : 'name1'
		}, 'Name')).toBe(true);

		expect(filter(list, {
			Name : 'name5',
		}, 'Name')).toBe(false);
	});
});