'use strict';

describe('Msg', function() {
	var Msg,
	    toaster;

	var fname = 'Field';
	beforeEach(module('msg'));
	beforeEach(inject(function($routeParams, _toaster_, _Msg_) {
		$routeParams.fname = fname;
		Msg = _Msg_;

		toaster = _toaster_;
		spyOn(toaster, 'pop');
	}));

	it('should gen _[type] methods', function() {
		Msg._success('ok');
		expect(toaster.pop).toHaveBeenCalledWith('success', fname, 'ok');
	});

	it('should gen getStart like methods', function() {
		expect(Msg.getStart('posTop')).toBe('正在置顶...');
	});

	it('should gen _$start like methods', function() {
		Msg._$start('posTop');
		expect(toaster.pop).toHaveBeenCalledWith('wait', fname, '正在置顶...');
	});
});