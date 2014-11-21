'use strict';

describe('FormResource', function() {
	var $rootScope,
	    FormResource,
	    $httpBackend,
	    $routeParams;

	beforeEach(EqualData);

	beforeEach(module('myApp'));

	beforeEach(inject(httpd()));

	beforeEach(inject(function(_$rootScope_, _FormResource_, _$httpBackend_, _$routeParams_) {
		$rootScope = _$rootScope_;
		FormResource = _FormResource_;
		$httpBackend = _$httpBackend_;
		$routeParams = _$routeParams_;

		$rootScope.$apply();
	}));

	it('should check $routeParams.fname ok', function() {
		expect($routeParams.fname).toBe('Field');
	});

	describe('mf', function() {
		it('should get mf', function() {
			var r;
			FormResource.mf(function(data) {
				r = data;
			});
			$httpBackend.flush();
			expect(r).toEqualData(__fixtures__['form/mf_ok'].Fields);
		});
	});

	describe('form', function() {
		it('should get data', function() {
			var r;
			FormResource.form(function(data) {
				r = data;
			});
			$httpBackend.flush();
			expect(r).toEqualData(__fixtures__['form/form_ok']);
		});
	});

	describe('recovery', function() {
		it('should get error', function() {
			var r,
			    err;
			FormResource.recovery({
				fname : 'err'
			}, function(data) {
				r = data;
			}, function(error) {
				err = error;
			});
			$httpBackend.flush();
			expect(r).not.toBeDefined();
			expect(err.data).toEqualData('Bad Request');
		});
	});
})
