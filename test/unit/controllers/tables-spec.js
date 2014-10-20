'use strict';

describe('Tables Controller', function() {
	var controller,
	    scope;
	beforeEach(module('myApp', FormsIniterInjector));
	beforeEach(inject(function($rootScope, $controller, $httpBackend) {
		scope = $rootScope.$new();

		$httpBackend.when('GET', "/Bucket/form").respond('{"Name":"Bucket"}');
		controller = $controller('TablesCtrl', {
			$scope : scope,
			$routeParams : {
				fname : 'Bucket'
			}
		});
		$httpBackend.flush();
	}));

	it('should get form form server', function() {
		expect(scope.form.Name).toBe('Bucket');
	});

	it('should generate right ops', function() {
		expect(scope.ops).toEqual(jasmine.objectContaining({
			load : '/Bucket/page',
			save : '/Bucket/binding/save',
			remove : '/Bucket/binding/remove',
			recovery : '/Bucket/recovery',
			migrate : '/Bucket/migrate'
		}));
	});
});
