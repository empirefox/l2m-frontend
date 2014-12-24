describe('use ngChecked to test protractor running status', function() {
	it('should check both checkBoxes', function() {
		browser.get('/scenario/protractor');
		expect(element(by.id('checkSlave')).getAttribute('checked')).toBeFalsy();
		element(by.model('master')).click();
		expect(element(by.id('checkSlave')).getAttribute('checked')).toBeTruthy();
	});
});