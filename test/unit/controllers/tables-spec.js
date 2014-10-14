'use strict';

describe('Tables Controller', function() {
	var controller,
	    scope;
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
			save : '/Bucket/save',
			remove : '/Bucket/remove',
			recovery : '/Bucket/recovery',
			migrate : '/Bucket/migrate'
		}));
	});
});
