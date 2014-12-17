'use strict';

angular.module('app.menu.codemirror', ['ui.codemirror']).directive('codemirrorMenu', function() {
	/*jshint camelcase: false */
	function linker(scope, iElement, iAttrs) {
		if (!scope.codemirror) {
			throw new Error('app.menu.codemirror need scope.codemirror to work');
		}
		if (!window.js_beautify) {
			throw new Error('app.menu.codemirror need js_beautify to work');
		}
		var ops = scope.$eval(iAttrs.codemirrorMenu);

		var beautify = function(engine, mode) {
			var output = engine(scope.codemirror.getValue(), ops);
			scope.codemirror.setValue(output);
			scope.codemirror.setOption('mode', mode);
		};
		// btn: {mode, fa, txt, tips, onClick()}
		scope.btns = [{
			fa : 'code',
			txt : 'js/json',
			tips : '美化javascript',
			onClick : function() {
				beautify(window.js_beautify, 'javascript');
			}
		}];
		if (window.html_beautify) {
			scope.btns.push({
				fa : 'html5',
				txt : 'html',
				tips : '美化html',
				onClick : function() {
					beautify(window.html_beautify, 'xml');
				}
			});
		}
		if (window.css_beautify) {
			scope.btns.push({
				fa : 'css3',
				txt : 'css',
				tips : '美化css',
				onClick : function() {
					beautify(window.css_beautify, 'css');
				}
			});
		}

	}

	return {
		restrict : 'A',
		priority : 10,
		link : linker
	};

});
