'use strict';

angular.module('app.menu.inner', ['ui.bootstrap']).directive('innerMenu', ['$compile',
function($compile) {
	// btn: {fa, txt, tips, onClick()}
	function template() {
		var tpl = '<div ng-if="btns.length" class="inner-menu-group">';
		tpl += '    <div class="btn-group-vertical" role="group">';
		tpl += '        <button type="button" class="btn btn-primary" tooltip-placement="left" tooltip="{{b.tips}}" ng-click="b.onClick()" ng-repeat="b in btns">';
		tpl += '            <i ng-if="b.fa" ng-class="\'fa-\'+b.fa" class="fa"></i><span ng-bind="b.txt"></span>';
		tpl += '        </button>';
		tpl += '     </div>';
		tpl += '   </div>';
		return tpl;
	}

	function linker(scope, iElement, iAttrs) {
		scope.btns = scope.btns || scope.$eval(iAttrs.innerMenu);
		if (!scope.btns) {
			return;
		}
		var tpl = angular.element(template());
		var btns = $compile(tpl)(scope);
		iElement.children().eq(0).prepend(btns);
	}

	return {
		restrict : 'A',
		priority : 1000,
		link : linker
	};

}]);
