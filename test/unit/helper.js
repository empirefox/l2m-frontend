'use strict';

function result(fixture) {
	return JSON.stringify(__fixtures__[fixture]);
}

function escape(value) {
	return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}

function EqualData() {
	jasmine.addMatchers({
		toEqualData : function() {
			return {
				compare : function(actual, expected) {
					return {
						pass : angular.equals(actual, expected)
					}
				}
			}
		}
	});
}

//GET    one    id=123>ok id=400>err
//DELETE remove id=123>ok id=400>err
function httpd(ok, err) {
	ok = ok || 'Field';
	err = err || 'err';
	var okName = '/' + ok;
	var errName = '/' + err;

	var parseUrl = function(act) {
		return new RegExp(escape(okName + '/' + act) + '.*');
	};

	return function($httpBackend, $location, $routeParams) {
		//respond ok
        $httpBackend.whenGET('/forms').respond(result('form/names_ok'));
        $httpBackend.whenGET('/mfs').respond(result('form/mfs_ok'));

		['form', 'mf', 'names'].forEach(function(act) {
			$httpBackend.whenGET(okName + '/' + act).respond(result('form/' + act + '_ok'));
		});

		['save'].forEach(function(act) {
			$httpBackend.whenPOST(okName + '/' + act).respond(result('form/' + act + '_ok'));
		});

		var act = 'saveup';
		$httpBackend.whenPOST(parseUrl(act)).respond(result('form/' + act + '_ok'));

		act = 'page';
		$httpBackend.whenGET(parseUrl(act)).respond(result('form/' + act + '_ok'), {
			'X-Total-Items' : 5,
            'X-Page' : 1,
            'X-Page-Size' : 10,
			'Access-Control-Expose-Headers' : 'X-Total-Items, X-Page, X-Page-Size'
		});

		$httpBackend.whenGET(okName + '/one/1?id=123').respond(result('form/one_ok'));

		['recovery'].forEach(function(act) {
			$httpBackend.whenDELETE(okName + '/' + act).respond(200);
		});

		['migrate', 'remove'].forEach(function(act) {
			$httpBackend.whenPUT(okName + '/' + act).respond(200);
		});

		//respond error
		'form,one,page,names'.split(',').forEach(function(act) {
			$httpBackend.whenGET(errName + '/' + act).respond(400, 'Bad Request');
		});

		act = 'save';
		$httpBackend.whenPOST(errName + '/' + act).respond(400, 'Bad Request');

		act = 'migrate';
		$httpBackend.whenPUT(errName + '/' + act).respond(400, 'Bad Request');

		'remove?id=400,recovery'.split(',').forEach(function(act) {
			$httpBackend.whenDELETE(errName + '/' + act).respond(400, 'Bad Request');
		});

		$location.path('/table/' + ok);
		$routeParams.fname = ok;
	}
}