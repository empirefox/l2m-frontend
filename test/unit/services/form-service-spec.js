'use strict';

describe('Form Serivce', function() {
	var service,
	    http;
	beforeEach(module('myApp', FormsIniterInjector));
	beforeEach(inject(function(FormService, $httpBackend) {
		service = FormService;
		http = $httpBackend;
		$httpBackend.when('GET', "/google/form").respond('200', '{"name":"google form"}');
	}));

	it('should get form data', function() {
		service.get('/google/form').then(function(form) {
			http.flush();
			expect(form.name).toBe('google form');
		});
	});
})
