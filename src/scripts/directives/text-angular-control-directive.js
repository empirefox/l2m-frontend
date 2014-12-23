'use strict';

angular.module('app.control.textAngular', ['app.control.field', 'textAngular']).config(['$provide',
function($provide) {
	// this demonstrates how to register a new tool and add it to the default toolbar
	$provide.decorator('taOptions', ['$delegate',
	function(taOptions) {
		// $delegate is the taOptions we are decorating
		// here we override the default toolbars and classes specified in taOptions.
		taOptions.toolbar = [
		//
		['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
		//
		['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
		//
		['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
		//
		['html', 'insertImage', 'insertLink', 'insertVideo']];
		return taOptions;
		// whatever you return will be the taOptions
	}]);
}]).config(['taTranslations',
function(taTranslations) {
	// moved to sub-elements
	//toggleHTML: "Toggle HTML",
	//insertImage: "Please enter a image URL to insert",
	//insertLink: "Please enter a URL to insert",
	//insertVideo: "Please enter a youtube URL to embed",
	taTranslations.html.buttontext = 'Toggle HTML';
	taTranslations.html.tooltip = 'Toggle html / Rich Text';
	// tooltip for heading - might be worth splitting
	taTranslations.heading.tooltip = 'Heading ';
	taTranslations.p.tooltip = 'Paragraph';
	taTranslations.pre.tooltip = 'Preformatted text';
	taTranslations.ul.tooltip = 'Unordered List';
	taTranslations.ol.tooltip = 'Ordered List';
	taTranslations.quote.tooltip = 'Quote/unqoute selection or paragraph';
	taTranslations.undo.tooltip = 'Undo';
	taTranslations.redo.tooltip = 'Redo';
	taTranslations.bold.tooltip = 'Bold';
	taTranslations.italic.tooltip = 'Italic';
	taTranslations.underline.tooltip = 'Underline';
	taTranslations.justifyLeft.tooltip = 'Align text left';
	taTranslations.justifyRight.tooltip = 'Align text right';
	taTranslations.justifyCenter.tooltip = 'Center';
	taTranslations.indent.tooltip = 'Increase indent';
	taTranslations.outdent.tooltip = 'Decrease indent';
	taTranslations.clear.tooltip = 'Clear formatting';
	taTranslations.insertImage.dialogPrompt = 'Please enter an image URL to insert';
	taTranslations.insertImage.tooltip = 'Insert image';
	taTranslations.insertImage.hotkey = 'the - possibly language dependent hotkey... for some future implementation';
	taTranslations.insertVideo.tooltip = 'Insert video';
	taTranslations.insertVideo.dialogPrompt = 'Please enter a youtube URL to embed';
	taTranslations.insertLink.tooltip = 'Insert / edit link';
	taTranslations.insertLink.dialogPrompt = "Please enter a URL to insert";
}]);
