'use strict';
angular.module('msg', ['ngRoute', 'toaster', 'dialogs.main']).constant('ActionText', {

	mf : {
		name : '获取mf'
	},
	mfs : {
		name : '获取mfs'
	},
	form : {
		name : '获取form结构'
	},

	page : {
		name : '获取列表'
	},

	saveAll : {
		name : '全部保存',
		confirm : {
			header : '保存操作',
			msg : '是否保存此次的所有操作'
		}
	},
	cancelBatch : {
		name : '取消批量操作',
		confirm : {
			header : '取消操作',
			msg : '是否取消？取消后，此次的所有操作将不会被保存'
		}
	},
	save : {
		name : '保存',
		confirm : {
			header : '保存',
			msg : '是否保存'
		}
	},
	saveup : {
		name : '保存',
		confirm : {
			header : '保存',
			msg : '是否保存'
		}
	},
	remove : {
		name : '删除',
		confirm : {
			header : '删除',
			msg : '是否删除？'
		}
	},

	forms : {
		name : '获取Table'
	},
	rearrange : {
		name : '全列表位置更新',
		confirm : {
			header : '更新位置',
			msg : '是否更新？可能需要一点时间'
		}
	},
	recovery : {
		name : '重建数据库',
		confirm : {
			header : '敏感操作',
			msg : '是否重建？重建后将清空所有数据'
		}
	},
	migrate : {
		name : '更新数据库结构',
		confirm : {
			header : '更新数据库结构',
			msg : '是否继续？更新后的数据库结构可能不程序不兼容'
		}
	},

	posTop : {
		name : '置顶'
	},
	posUp : {
		name : '上移'
	},
	posDown : {
		name : '下移'
	},
	posUpSingle : {
		name : '上移'
	},
	posBottom : {
		name : '置底'
	}

}).constant('Pops', {
	//type, title, body, timeout, bodyOutputType
	rsFull : {
		type : 'error',
		title : '列表容量超出',
		body : '需先保存后手动重排',
		timeout : 0
	},
	zeroRemoves : {
		type : 'info',
		body : '没有可删除的多余项'
	},
	alreadyTop : {
		type : 'info',
		body : '已是最顶项'
	},
	alreadyBottom : {
		type : 'info',
		body : '已是最底项'
	}
}).factory('Msg', ['$log', '$routeParams', 'toaster', 'dialogs', 'ActionText', 'Pops',
function($log, $routeParams, toaster, dialogs, ActionText, Pops) {
	var isDefined = angular.isDefined;

	// toaster
	var defaultTemplate = {
		start : '正在{{name}}...',
		success : '已{{name}}',
		error : '{{name}}失败'
	};

	var defaultType = {
		start : 'wait',
		success : 'success',
		error : 'error'
	};

	var msg = {};

	// like _success (type)
	'wait,success,error,info,warning'.split(',').forEach(function(type) {
		msg['_' + type] = function(text) {
			toaster.pop(type, $routeParams.fname, text);
		};
	});

	// like getStart
	angular.forEach(defaultTemplate, function(v, k) {
		var getText = msg['get' + S(k).capitalize().s] = function(act) {
			var txt = angular.extend({}, defaultTemplate, ActionText[act]);
			return S(txt[k]).template(txt).s;
		};

		// msg._$start msg._$success msg._$error
		msg['_$' + k] = function(act) {
			msg['_' + defaultType[k]](getText(act));
		};
	});

	msg.start = function(act) {
		return function() {
			msg._$start(act);
		};
	};

	msg.success = function(act) {
		return function() {
			toaster.clear();
			msg._$success(act);
		};
	};

	//hide >>> popName >>> succeed?ok >>> error
	msg.error = function(act) {
		return function(error) {
			$log.error(error);
			if (isDefined(error) && (error.hide || error.popName)) {
				msg.pop(error.popName);
				return;
			}
			toaster.clear();
			if (isDefined(error) && error.succeed) {
				msg._$success(act);
				return;
			}
			msg._$error(act);
		};
	};

	msg.end = function(act) {
		return this.then(msg.success(act)).catch(msg.error(act));
	};

	msg.pop = function(name) {
		var pop = Pops[name];
		if (pop) {
			toaster.pop(pop.type, pop.title, pop.body, pop.timeout, pop.bodyOutputType);
		}
	};

	// dialogs
	msg._confirm = function(header, msg, opts) {
		return dialogs.confirm(header, msg, opts).result;
	};

	msg.confirm = function(act) {
		return function(data) {
			var confirm = ActionText[act].confirm;
			if (confirm) {
				return msg._confirm(confirm.head, confirm.msg, confirm.opts).then(function() {
					return data;
				});
			}
			return data;
		};
	};

	return msg;
}]);
