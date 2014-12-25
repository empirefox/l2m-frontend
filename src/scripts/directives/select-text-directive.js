'use strict';

angular.module('app.text.select', ['ngSanitize']).directive('selectText', function() {

	return {
		restrict : 'A',
		link : function(scope, element) {
			element.on('mouseenter', function() {
				var text = element[0],
				    range,
				    selection;
				if (document.body.createTextRange) {
					range = document.body.createTextRange();
					range.moveToElementText(text);
					range.select();
				} else if (window.getSelection) {
					selection = window.getSelection();
					range = document.createRange();
					range.selectNodeContents(text);
					selection.removeAllRanges();
					selection.addRange(range);
				}
			});
		}
	};
});
