'use strict';

//load save remove recovery migrate
describe('Form Directive', function() {
	beforeEach(module('iniu-tpl'));
	beforeEach(module('myApp', function($provide) {
		return $provide.decorator('FormsIniter', function() {
			return {
				load : function() {
					return [{
						Name : 'Bu',
						Title : 'BU'
					}, {
						Name : 'Cu',
						Title : 'CU'
					}];
				}
			};
		});
	}));

	var http;
	var baseDir = 'views/directive-templates/';
	var fnames1 = ['textarea', 'checkbox', 'date', 'dropdown', 'hidden', 'radio', 'kindeditor'];
	var fnames2 = ['text', 'search', 'url', 'telephone', 'email', 'password', 'dateTimeLocal', 'month', 'number', 'time', 'week'];
	beforeEach(inject(function($templateCache, _$httpBackend_) {
		http = _$httpBackend_;
		var url = baseDir + 'form/form.html';
		http.whenGET(url).respond($templateCache.get(url));
		fnames1.forEach(function(fname) {
			url = baseDir + 'field/' + fname + '.html';
			http.whenGET(url).respond($templateCache.get(url));
		});
		fnames2.forEach(function(fname) {
			url = baseDir + 'field/' + 'textfield.html';
			http.whenGET(url).respond($templateCache.get(url));
		});

		backends.forEach(function(backend) {
			http.when(backend.action, backend.url).respond(200, JSON.stringify(backend.data));
		});
	}));

	var scope,
	    $compile,
	    element;

	function _form() {
		return {
			Title : "表单字段",
			Fields : [{
				Name : "Id",
				Type : "hidden"
			}, {
				Name : "Num",
				Type : "number"
			}, {
				Name : "Name",
				Required : true,
				Maxlength : 64
			}, {
				Name : "Description",
				Type : "textfield",
				Maxlength : 128
			}],
			New : {
				Name : "new form name"
			}
		}
	};
	function _ops() {
		return {
			load : '/load/ok',
			save : '/save',
			remove : '/remove',
			recovery : '/recovery',
			migrate : '/migrate'
		}
	};

	function pre() {
		return {
			form : _form(),
			ops : _ops()
		};
	};

	function list() {
		return [{
			error : 0,
			content : {
				Id : 1,
				Name : 'Bucket2',
				Num : 2,
				Description : 'bucket number 2'
			}
		}, {
			Id : 2,
			Name : 'Bucket3',
			Num : 30
		}, {
			Id : 3,
			Name : 'Bucket4',
			Num : 4,
			Description : 'bucket number 4'
		}];
	}

	var backends = [{
		action : 'GET',
		url : /\/load\/ok(\?.*)?$/,
		data : {
			error : 0,
			content : {
				list : list(),
				page_count : 2,
				total : 3
			}
		}
	}, {
		action : 'POST',
		url : '/save/ok',
		data : {
			error : 0,
			content : {
				Id : 2,
				Name : 'Bucket3',
				Num : 100
			}
		}
	}, {
		action : 'POST',
		url : '/save/err',
		data : {
			error : 1,
			content : 'Save Error'
		}
	}, {
		action : 'POST',
		url : '/remove/ok',
		data : {
			error : 0,
			content : 'Remove ok'
		}
	}, {
		action : 'POST',
		url : '/remove/err',
		data : {
			error : 1,
			content : 'Remove Error'
		}
	}, {
		action : 'PUT',
		url : '/recovery/ok',
		data : {
			error : 0,
			content : ''
		}
	}, {
		action : 'PUT',
		url : '/recovery/err',
		data : {
			error : 1,
			content : 'Remove Error'
		}
	}, {
		action : 'PUT',
		url : '/migrate/ok',
		data : {
			error : 0,
			content : ''
		}
	}, {
		action : 'PUT',
		url : '/migrate/err',
		data : {
			error : 1,
			content : 'Remove Error'
		}
	}];

	beforeEach(inject(function($rootScope, _$compile_) {
		var $scope = $rootScope.$new();
		$scope.form = pre().form;
		$scope.ops = pre().ops;
		$scope.rs = [];

		$compile = _$compile_;
		element = angular.element('<form-directive form-metas="form" ops="ops"></form-directive>');
		var content=$compile(element)($scope);

		$scope.$digest();

		scope = element.isolateScope() || element.scope();

		scope.alert = {};
	}));

	describe('no http', function() {
		it('newRecord should create a new record from form.New template', function() {
			expect(scope.newRecord()).toBeDefined();
			expect(scope.newRecord().isNew).toBe(true);
		});

		it('should set scope "backend record" and "frontend editing"', function() {
			var e = list()[1];
			e.isNew = true;
			expect(scope.record).toBeUndefined();
			expect(scope.editing).toBeUndefined();

			expect(element.find('.list-group>a.active').length).toBe(0);
			scope.edit(e);
			scope.$digest();
			expect(element.find('.list-group>a.active').length).toBe(1);

			expect(scope.record).toBe(e);
			expect(scope.editing).not.toBe(e);
			expect(JSON.stringify(scope.editing)).toBe(JSON.stringify(e));

			expect(scope.editing.Num).toBe(e.Num);
			scope.editing.Num = -1;
			scope.$digest();
			expect(scope.editing.Num).not.toBe(e.Num);
			scope.reset();
			scope.$digest();
			expect(scope.editing.Num).toBe(e.Num);
		});
	});

	describe('with http', function() {

		it('should load list from server', function() {
			expect(element.find('.list-group.ng-hide').length).toBe(1);

			expect(element.scope().rs.length).toBe(0);

			scope.ops.load = '/load/ok';
			scope.load();
			http.flush();
			scope.$digest();

			expect(scope.alert.type).toBe('success');
			expect(scope.rs.length).toBe(3);

			expect(element.find('.list-group.ng-hide').length).toBe(0);
		});

		it('should save a exist record to server and update local data form server', function() {
			http.flush();
			scope.ops.save = '/save/ok';
			scope.rs = list();
			scope.edit(scope.rs[1]);
			scope.$digest();

			expect(scope.rs.length).toBe(3);
			expect(scope.record.Num).toBe(30);
			expect(scope.editing.Num).toBe(30);
			scope.save();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('success');
			expect(scope.rs.length).toBe(3);
			expect(scope.record).toBe(scope.rs[1]);
			expect(scope.record.Num).toBe(100);
			expect(scope.editing.Num).toBe(100);
		});

		it('shoud save new record to server and update local data', function() {
			scope.ops.save = '/save/ok';
			scope.rs = list();
			scope.edit({
				Name : 'Bucket3',
				Num : 3,
				isNew : true
			});
			scope.$digest();
			expect(scope.rs.length).toBe(3);
			expect(scope.record.Id).toBeUndefined();
			expect(scope.editing.Id).toBeUndefined();
			scope.save();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('success');
			expect(scope.rs.length).toBe(4);
			expect(scope.record).toBe(scope.rs[3]);
			expect(scope.record.Id).toBe(2);
			expect(scope.editing.Id).toBe(2);
		});

		it('should remove form server and update local data', function() {
			http.flush();
			scope.ops.remove = '/remove/ok';
			scope.rs = list();
			scope.edit(scope.rs[1]);
			scope.$digest();
			expect(scope.rs.length).toBe(3);
			scope.remove();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('success');
			expect(scope.rs.length).toBe(2);
		});

		it('should directly show status', function() {
			http.flush();
			scope.ops.save = '/save/err';
			scope.save();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('error');

			scope.alert = {};
			scope.ops.remove = '/remove/err';
			scope.remove();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('error');

			scope.alert = {};
			scope.ops.recovery = '/recovery/err';
			scope.recovery();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('error');

			scope.alert = {};
			scope.ops.migrate = '/migrate/err';
			scope.migrate();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('error');

			scope.alert = {};
			scope.ops.recovery = '/recovery/ok';
			scope.recovery();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('success');

			scope.alert = {};
			scope.ops.migrate = '/migrate/ok';
			scope.migrate();
			http.flush();
			scope.$digest();
			expect(scope.alert.type).toBe('success');
		});
	});

});
