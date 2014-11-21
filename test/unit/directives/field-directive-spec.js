'use strict';

describe('FieldDirective', function() {

	beforeEach(module('myApp'));
	beforeEach(EqualData);
	beforeEach(inject(httpd()));
	
	var $httpBackend;
	var baseDir = '/views/directive-templates/field/';
	var fnames = ['textarea'];
	beforeEach(inject(function($templateCache, _$httpBackend_) {
		$httpBackend = _$httpBackend_;
		fnames.forEach(function(fname) {
			var url = baseDir + fname + '.html';
			$httpBackend.whenGET(url).respond($templateCache.get(url));
		});
	}));

	var scope,
	    linkFn;
	beforeEach(inject(function($rootScope, $compile) {
		scope = $rootScope;
		linkFn = $compile('<field-directive field="field" record="editing"></field-directive>');
	}));

	//model -> UI
	describe('textarea', function() {
		var field;

		beforeEach(function() {
			scope.field = {
				Name : 'Description',
				Title : '描述',
				Type : 'textarea',
				Required : true
			};
			field = linkFn(scope);
			//此处是为什么field-directive.js78行不执行的原因
			//$httpBackend.flush();
			scope.$digest();
		});

		it('should work correctly with only field value', function() {
			expect(field.find('span').first().text()).toBe('描述');
			expect(field.find('textarea').text()).toBe('');
		});

		it('should change require status', function() {
			expect(field.find('.text-danger.ng-hide').length).toBe(0);
			scope.editing = {
				Description : "hello"
			};
			scope.$digest();
			expect(field.find('.text-danger.ng-hide').length).toBe(1);
		});
	});

	//other field directives
	//.........
});
