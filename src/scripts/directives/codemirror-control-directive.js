'use strict';

angular.module('app.control.codemirror', ['app.control.field', 'app.menu.inner', 'app.menu.codemirror']).directive('codemirrorControl', function() {

	// ops means codemirror ops, js-beautify ops is NOT supported yet
	function link(scope) {
		var defaultOps = {
			lineNumbers : true,
			theme : 'twilight',
			lineWrapping : true,
			mode : 'xml',
			onLoad : function(_editor) {
				scope.codemirror = _editor;
			}
		};
		scope.ops = angular.extend({}, defaultOps, scope.ops);
		scope.ops.readOnly = (scope.ops.readOnly || scope.field.Readonly) ? "nocursor" : false;
	}

	return {
		restrict : 'A',
		link : {
			pre : link
		}
	};
});
