"use strict";

describe('codemirror', function() {
	beforeEach(function() {
		this.addMatchers(require('../util/toHaveClassMatchers'));
		browser.get('/scenario/codemirror');
	});
	var fieldControl = element(by.tagName('field-control'));
	var field = element(by.exactBinding('field'));
	var record = element(by.exactBinding('editing'));
	var editorValid = element(by.binding('myForm.CodeMirror.$valid'));
	var editorError = element(by.binding('myForm.CodeMirror.$error'));
	var formValid = element(by.binding('myForm.$valid'));
	var formRequired = element(by.binding('!!myForm.$error.required'));

	var jsBeautify = element.all(by.css('div.inner-menu-group button')).first();
	var editorPane = element(by.tagName('textarea'));
    var editorTrigger = element(by.css('div.CodeMirror-scroll'));

	it('should init to model', function() {
		expect(field.getText()).toContain('"CodeMirror"');
		expect(editorValid.getText()).toContain('false');
		expect(formValid.getText()).toContain('false');
		expect(formRequired.getText()).toContain('true');
	});

	it('should change record when inputing text and beautify code', function() {
		editorTrigger.click();

		editorPane.sendKeys('{"a":1}');
		expect(record.getText()).toContain('{\\"a\\":1}');

		jsBeautify.click();
		expect(record.getText()).toContain('{\\n \\"a\\": 1\\n}');
	});
});
