"use strict";
// Add the custom matchers to jasmine
beforeEach(function() {
	this.addMatchers(require('../util/toHaveClassMatchers'));
	browser.get('/scenario/textAngular');
});

ddescribe('textAngular', function() {
	var fieldControl = element(by.tagName('field-control'));
	var field = element(by.exactBinding('field'));
	var record = element(by.exactBinding('editing'));
	var editorValid = element(by.binding('myForm.TaEditor.$valid'));
	var editorError = element(by.binding('myForm.TaEditor.$error'));
	var formValid = element(by.binding('myForm.$valid'));
	var formRequired = element(by.binding('!!myForm.$error.required'));

	var taDiv = element(by.css('[text-angular]'));
	var editorPane = element(by.model('html'));
	var editorBar = element(by.css('div.ta-toolbar.btn-toolbar'));

	it('should init to model', function() {
		expect(field.getText()).toContain('"TaEditor"');
		expect(editorValid.getText()).toContain('false');
		expect(formValid.getText()).toContain('false');
		expect(formRequired.getText()).toContain('true');
	});

	it('should create text-angular-control', function() {
		expect(taDiv.getAttribute('placeholder')).toBe('new content here');
	});
});
