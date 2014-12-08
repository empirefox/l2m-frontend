'use strict';

// all Ips is {Ips: mods}
angular.module('formServices', []).factory('FormResource', ['$location', '$routeParams', '$resource', 'CpsService',
function($location, $routeParams, $resource, CpsService) {
	return $resource('/:fname/:act', {
		fname : function() {
			return $routeParams.fname;
		}
	}, {
        mf : {
            method : 'GET',
            params : {
                act : 'mf'
            }
        },
        mfs : {
            method : 'GET',
            isArray : true,
            params : {
                fname : 'mfs',
                act : function() {
                    var id = $location.search().form_id;
                    if (angular.isDefined(id)) {
                        return id;
                    }
                }
            }
        },
		form : {
			method : 'GET',
			params : {
				act : 'form',
			}
		},

		one : {
			method : 'GET',
			params : {
				act : '1',
			}
		},
		page : {
			method : 'GET',
			isArray : true,
			params : {
				act : 'page'
			}
		},
		names : {
			method : 'GET',
			isArray : true,
			params : {
				act : 'names'
			}
		},
		saveAll : {
			method : 'POST',
			isArray : true,
			params : {
				act : 'saveall'
			}
		},
		save : {
			method : 'POST',
			params : {
				act : 'save'
			}
		},
		saveup : {
			method : 'POST',
			params : {
				act : 'saveup',
				cp : CpsService.getString
			}
		},
		remove : {
			method : 'PUT',
			params : {
				act : 'remove'
			}
		},

		forms : {
			method : 'GET',
			isArray : true,
			cache : true,
			params : {
				fname : 'forms'
			}
		},
		rearrange : {
			method : 'PUT',
			isArray : true,
			params : {
				act : 'rearrange'
			}
		},
		recovery : {
			method : 'DELETE',
			params : {
				act : 'recovery'
			}
		},
		migrate : {
			method : 'PUT',
			params : {
				act : 'migrate'
			}
		},

		modIps : {
			method : 'POST',
			isArray : true,
			params : {
				act : 'modips'
			}
		},
		xpos : {
			method : 'POST',
			params : {
				act : 'xpos'
			}
		},
		posTop : {
			method : 'PUT',
			params : {
				act : 'postop',
			}
		},
		posBottom : {
			method : 'POST',
			isArray : true,
			params : {
				act : 'posbottom'
			}
		},
		posUpSingle : {
			method : 'POST',
			params : {
				act : 'posupsingle'
			}
		}
	});
}]).service('FormService', ['FormResource',
function(FormResource) {
	function applyArgs(handler, names) {
		var args = [];
		angular.forEach(names, function(name) {
			if (angular.isDefined(handler[name])) {
				args.push(handler[name]);
			}
		});
		return args;
	}


	this.applyArgs = applyArgs;

	this.FP = function(handler) {
		return function() {
			var args = applyArgs(handler, ['param', 'postData', 'handle', 'error']);
			return FormResource[handler.act].apply(null, args).$promise;
		};
	};
	this.F = function(name) {
		return function() {
			return FormResource[name]().$promise;
		};
	};
}]);
