describe('FormDirectiveCtrl', function() {
	beforeEach(module('myApp'));
	beforeEach(EqualData);
	beforeEach(inject(httpd()));

	var baseDir = '/views/directive-templates/';
	var fnames1 = ['textarea', 'checkbox', 'date', 'dropdown', 'hidden', 'radio', 'kindeditor'];
	var fnames2 = ['text', 'search', 'url', 'telephone', 'email', 'password', 'dateTimeLocal', 'month', 'number', 'time', 'week'];
	beforeEach(inject(function($templateCache, $httpBackend) {
		var url = baseDir + 'form/form.html';
		$httpBackend.whenGET(url).respond($templateCache.get(url));
		fnames1.forEach(function(fname) {
			url = baseDir + 'field/' + fname + '.html';
			$httpBackend.whenGET(url).respond($templateCache.get(url));
		});
		fnames2.forEach(function(fname) {
			url = baseDir + 'field/' + 'textfield.html';
			$httpBackend.whenGET(url).respond($templateCache.get(url));
		});
	}));

	var $httpBackend,
	    scope,
	    controller,
	    Msg;

	beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _Msg_) {
		$httpBackend = _$httpBackend_;
		scope = $rootScope.$new();
		Msg = _Msg_;
		spyOn(Msg, 'confirm');
		spyOn(Msg, '_$start');
		spyOn(Msg, '_$success');
		spyOn(Msg, '_$error');
		spyOn(Msg, 'pop');
		spyOn(Msg, 'end').and.callFake(function(act) {
			this.then(function() {
				Msg._$success(act);
			}).catch(function() {
				Msg._$error(act);
			});
		});

		controller = $controller('FormDirectiveCtrl', {
			'$scope' : scope
		});

		$httpBackend.flush();
	}));

    it('should fetch the form instance', function() {
        expect(scope.form).toEqualData(__fixtures__['form/form_ok']);
    });

    it('should fetch the mfs instance', function() {
        expect(scope.mfs).toEqualData(__fixtures__['form/mfs_ok']);
    });

	it('should create a new record', function() {
		expect(scope.newRecord().Pos).toEqual(-1);
	});

	it('should GET page list', function() {
		expect(scope.pager).toBeDefined();

		expect(scope.rs.length).toBe(5);
		expect(scope.pager.totalItems).toBe(5);
	});

	it('should POST an exist record to server and update local data form server', function() {
		//prepare
		scope.edit(scope.rs[0]);

		expect(scope.rs.length).toBe(5);
		expect(scope.record).toEqualData(__fixtures__['form/page_ok'][4])
		expect(scope.editing).toEqualData(__fixtures__['form/page_ok'][4])

		// save
		scope.save();
		$httpBackend.flush();

		expect(scope.rs.length).toBe(5);
		expect(scope.record).toEqualData(__fixtures__['form/save_ok'])
		expect(scope.editing).toEqualData(__fixtures__['form/save_ok'])
	});

	it('should POST a non-exist non-Pos record to server and update local data form server', function() {
		//prepare
		scope.edit();

		expect(scope.rs.length).toBe(5);
		expect(scope.record).toEqualData(scope.newRecord());
		expect(scope.editing.Id).toBeUndefined();
		scope.hasPos = false;

		// save
		scope.save();
		$httpBackend.flush();

		expect(scope.rs.length).toBe(6);
		expect(scope.record).toEqualData(__fixtures__['form/save_ok'])
		expect(scope.editing).toEqualData(__fixtures__['form/save_ok'])
	});

	it('should POST a non-exist with Pos record to server and update local data form server', function() {
		//prepare
		scope.edit();

		expect(scope.rs.length).toBe(5);
		expect(scope.record).toEqualData(scope.newRecord());
		expect(scope.editing.Id).toBeUndefined();
		expect(scope.hasPos).toBe(true);

		// save
		scope.save();
		$httpBackend.flush();

		expect(scope.rs.length).toBe(6);
		expect(scope.rs[4].Pos).toBe(16);
		expect(scope.record).toEqualData(__fixtures__['form/save_ok'])
		expect(scope.editing).toEqualData(__fixtures__['form/save_ok'])
	});

	it('should DELETE record when remove called', function() {
		//prepare
		scope.edit(scope.rs[0]);

		expect(scope.rs.length).toBe(5);

		scope.remove();
		$httpBackend.flush();

		expect(Msg._$success).toHaveBeenCalledWith('remove');
		expect(scope.rs.length).toBe(4);
		expect(scope.rs[0].Id).not.toBe(123);
		expect(scope.record).toEqualData(scope.newRecord());
	});

	it('should recovery ok', function() {
		//prepare
		expect(scope.rs.length).toBe(5);

		scope.recovery();
		$httpBackend.flush();

		expect(scope.rs.length).toBe(0);
	});

	it('should migrate ok', function() {
		//prepare
		expect(scope.rs.length).toBe(5);

		scope.migrate();
		$httpBackend.flush();

		expect(scope.rs.length).toBe(5);
		expect(Msg._$success).toHaveBeenCalledWith('migrate');
	});

	//isFields
	it('should tips shouldCreate correctly', function() {
		expect(scope.shouldCreate({
			"Name" : "Name New"
		})).toBe(true);

		expect(scope.shouldCreate({
			"Name" : "Name123"
		})).toBe(false);
	});

	it('should tips shouldDelete correctly', function() {
		expect(scope.shouldDelete({
			"Name" : "Description"
		})).toBe(true);

		expect(scope.shouldDelete({
			"Name" : "Temp"
		})).toBe(false);
	});

	it('should remove all unexpected from rs', function() {
		expect(scope.rs.length).toBe(5);

		scope.removeUnexpected();
		$httpBackend.flush();

		expect(scope.rs.length).toBe(1);
		expect(scope.rs[0].Name).toBe("Pos");
	});
});
