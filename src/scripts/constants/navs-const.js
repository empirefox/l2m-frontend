angular.module('navs-const', []).constant('navs', [{
	display : '从这里开始',
	when : '/',
	templateUrl : '/views/main.html',
	controller : 'MainCtrl'
}, {
	display : '测试编辑器',
	when : '/kindeditors',
	templateUrl : '/views/test-with-editor.html',
	controller : 'KindeditorsCtrl'
}, {
	display : '多行文本转变量',
	when : '/strings',
	templateUrl : '/views/multitext.html',
	controller : 'MultiTextCtrl'
}, {
	display : 'Fa列表',
	when : '/fas',
	templateUrl : '/views/fa-list.html',
	controller : 'FaListCtrl'
}])