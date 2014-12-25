'use strict';

describe('FieldDirective', function() {

	beforeEach(module('app.control.field'));
	beforeEach(module('l2m-tpl'));
	beforeEach(module('ngRoute'));
	beforeEach(EqualData);
	beforeEach(inject(httpd()));

	var scope,
	    $rootScope,
	    linkFn,
	    template;
	beforeEach(inject(function(_$rootScope_, $compile) {
		$rootScope = _$rootScope_;
		linkFn = $compile('<field-control field="field" record="editing"></field-control>');
	}));

	//model -> UI
	describe('textarea', function() {
		var field;

		beforeEach(function() {
			$rootScope.field = {
				Name : 'Description',
				Title : '描述',
				Type : 'textarea',
				Required : true
			};
			field = linkFn($rootScope);
			scope = field.isolateScope() || field.scope();
			$rootScope.$digest();
		});

		it('should work correctly with only field value', function() {
			expect(field.find('span').first().text()).toBe('描述');
			expect(field.find('textarea').text()).toBe('');
		});

		it('should change require status', function() {
			expect(field.find('.text-danger.ng-hide').length).toBe(0);
			$rootScope.editing = {
				Description : "hello"
			};
			$rootScope.$digest();
			expect(field.find('.text-danger.ng-hide').length).toBe(1);
		});
	});

	//other field directives tested in e2e
});
