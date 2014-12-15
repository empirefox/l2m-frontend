'use strict';

angular.module('app.control.codemirror', ['app.menu.inner', 'app.menu.codemirror']).directive('codemirrorControl', function() {
	return {
		restrict : 'A',
		link : postLink
	};

	// ops means codemirror ops, js-beautify ops is NOT supported yet
	function postLink(scope, iElement, iAttrs) {
		scope.ops = scope.ops || {};
		scope.ops.readOnly = (scope.ops.readOnly || scope.field.Readonly) ? "nocursor" : false;
	}

});
