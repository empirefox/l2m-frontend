'use strict';

describe('app.form.service', function() {
	var $rootScope,
	    FormResource,
	    FormService,
	    $httpBackend,
	    $routeParams;

	beforeEach(EqualData);

	beforeEach(module('app.form.service'));

	beforeEach(inject(httpd()));

	beforeEach(inject(function(_$rootScope_, _FormResource_, _FormService_, _$httpBackend_, _$routeParams_) {
		$rootScope = _$rootScope_;
		FormResource = _FormResource_;
		FormService = _FormService_;
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
			expect(r).toEqualData(__fixtures__['form/mf_ok']);
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

	describe('FormResource', function() {
		it('should get apply args', function() {
			var h = {
				act : 'form',
				param : {
					size : 10
				},
				postData : {
					data : 1
				}
			};
			var args = FormService.applyArgs(h, ['param', 'postData', 'handle', 'error']);
			expect(args).toEqual([{
				size : 10
			}, {
				data : 1
			}]);
		});
	});
})
