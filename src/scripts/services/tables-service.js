'use strict';

angular.module('app.data.tables', ['app.form.service', 'app.msg']).factory('TablesService', ['FormResource', 'Msg',
function(FormResource, Msg) {
	var TablesService = {};

	TablesService.getTables = function() {
		FormResource.forms(function(data) {
			TablesService.tables = data;
		}, function() {
			Msg.loadTablesError();
		});
	};

	TablesService.init = function() {
		if (!TablesService.tables) {
			TablesService.getTables();
		}
	};

	TablesService.init();

	return TablesService;
}]);
