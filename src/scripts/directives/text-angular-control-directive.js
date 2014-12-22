'use strict';

angular.module('app.control.textAngular', ['textAngular']).config(['$provide',
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

	$provide.decorator('taTranslations', function() {
		return {
			// moved to sub-elements
			//toggleHTML: "Toggle HTML",
			//insertImage: "Please enter a image URL to insert",
			//insertLink: "Please enter a URL to insert",
			//insertVideo: "Please enter a youtube URL to embed",
			html : {
				buttontext : 'Toggle HTML',
				tooltip : 'Toggle html / Rich Text'
			},
			// tooltip for heading - might be worth splitting
			heading : {
				tooltip : 'Heading '
			},
			p : {
				tooltip : 'Paragraph'
			},
			pre : {
				tooltip : 'Preformatted text'
			},
			ul : {
				tooltip : 'Unordered List'
			},
			ol : {
				tooltip : 'Ordered List'
			},
			quote : {
				tooltip : 'Quote/unqoute selection or paragraph'
			},
			undo : {
				tooltip : 'Undo'
			},
			redo : {
				tooltip : 'Redo'
			},
			bold : {
				tooltip : 'Bold'
			},
			italic : {
				tooltip : 'Italic'
			},
			underline : {
				tooltip : 'Underline'
			},
			justifyLeft : {
				tooltip : 'Align text left'
			},
			justifyRight : {
				tooltip : 'Align text right'
			},
			justifyCenter : {
				tooltip : 'Center'
			},
			indent : {
				tooltip : 'Increase indent'
			},
			outdent : {
				tooltip : 'Decrease indent'
			},
			clear : {
				tooltip : 'Clear formatting'
			},
			insertImage : {
				dialogPrompt : 'Please enter an image URL to insert',
				tooltip : 'Insert image',
				hotkey : 'the - possibly language dependent hotkey ... for some future implementation'
			},
			insertVideo : {
				tooltip : 'Insert video',
				dialogPrompt : 'Please enter a youtube URL to embed'
			},
			insertLink : {
				tooltip : 'Insert / edit link',
				dialogPrompt : "Please enter a URL to insert"
			}
		};
	});
}]);