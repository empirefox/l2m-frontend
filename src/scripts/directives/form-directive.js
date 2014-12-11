angularApp.controller('FormDirectiveCtrl', ['$scope', '$location', '$routeParams', 'FormResource', 'FormService', 'CpsService', 'Msg', '$q', 'ArrFn', 'JsonFn', 'PosFn',
function($scope, $location, $routeParams, FormResource, FormService, CpsService, Msg, $q, ArrFn, JsonFn, PosFn) {

	var copy = angular.copy,
	    noop = angular.noop,
	    isDefined = $scope.isDefined = angular.isDefined,
	    isUndefined = $scope.isUndefined = angular.isUndefined,
	    FP = FormService.FP;

	$scope.isFields = $routeParams.fname === 'Field';
	$scope.canSetPos = CpsService.canSetPos();
	$scope.ops = $scope.ops || {};
	var ban = $scope.ops.ban || {};

	$scope.pager = $scope.ops.pager || {
		maxSize : 5,
		totalItems : 0,
		itemsPerPage : 20,
		currentPage : 1
	};

	function _if(could, data) {
		var deferred = $q.defer();
		if (could) {
			deferred.resolve(data);
		} else {
			deferred.reject({
				hide : true
			});
		}
		return deferred.promise;
	}

	function begin(act, stopWhen, stopPop) {
		return _if(!ban[act]).then(function() {
			if (stopWhen) {
				return $q.reject({
					popName : stopPop
				});
			}
		}).then(Msg.confirm(act)).then(Msg.start(act));
	}

	function hasPos() {
		return $scope.form.Fields.some(function(field) {
			return field.Name === 'Pos';
		});
	}

	function isEditNew() {
		return isUndefined($scope.editing.Id);
	}

	function isLastPage() {
		return $scope.pager.currentPage * $scope.pager.itemsPerPage >= $scope.pager.totalItems;
	}

	function isFirstPage() {
		return $scope.pager.currentPage === 1;
	}

	function removeRecord(record, reserve) {
		if (!reserve) {
			$scope.rs.remove(record);
			if ($scope.record === record) {
				$scope.edit();
			}
		}
	}

	//promise handler return ipsHolder
	function updateIps(data) {
		var ips = PosFn.isIps(data) ? data : (data.Ips || []);
		ips.forEach(function(ip) {
			var copy = function(record) {
				if (record.Id === ip.Id) {
					record.Pos = ip.Pos;
					return true;
				}
				return false;
			};
			$scope.rs.some(copy);
			[$scope.record, $scope.editing].some(copy);
		});
		return data;
	}

	function ipsOnError(data) {
		updateIps(data);
		return $q.reject(data);
	}

	function remoteAction(handler) {
		var act = handler.act;
		var promise = begin(act, handler.stopWhen, handler.stopPop).then(handler.pre || noop).then(FP(handler)).then(updateIps, ipsOnError);
		Msg.end.call(promise, act);
	}

	function simpleAction(handler) {
		var act = handler.act;
		var promise = begin(act, handler.stopWhen, handler.stopPop).then(handler.handle || noop);
		Msg.end.call(promise, act);
	}

	function pass(data) {
		return function() {
			return data;
		};
	}

	function saveNormal() {
		var isNew = isEditNew();
		return $scope.editing.$save(function(record) {
			if (isNew) {
				$scope.rs.push(record);
			} else {
				$scope.rs.replace($scope.record, record);
			}
			$scope.edit(record);
		});
	}

	//promise return saved value
	function saveNormalWithPos(pos) {
		$scope.editing.Pos = pos;
		return saveNormal().finally(function() {
			if (isEditNew()) {
				$scope.editing.Pos = $scope.record.Pos;
			}
		});
	}

	function saveWithnewPosWithoutShow(newPos) {
		if (isDefined(newPos.Mods)) {
			var ips = newPos.Mods;
			return FormResource.modIps(ips).$promise.then(pass(ips)).then(updateIps).then(pass(newPos.Pos)).then(saveNormalWithPos);
		}

		if (newPos === -1) {
			return FormResource.saveup($scope.editing).$promise.then(function(data) {
				var record = new FormResource(data.Newer);
				$scope.rs.push(record);
				$scope.edit(record);
				return data;
			});
		}

		if (newPos > 0) {
			return saveNormalWithPos(newPos.Pos);
		}
	}

	//form_nodes_renderer.html
	function xpos(i1, i2) {
		var r1 = $scope.rs[i1];
		var r2 = $scope.rs[i2];
		return FormResource.xpos({
			Id1 : r1.Id,
			Id2 : r2.Id
		}).$promise.then(function(data) {
			PosFn.xpos(r1, r2);
			$scope.rs.sort(PosFn.desc);
			return data;
		});
	}

	function posUpSingle(iNow, reverse) {
		var record = $scope.rs[iNow];
		return FormResource.posUpSingle({
			reverse : reverse,
			search : CpsService.pSearch(record)
		}, PosFn.newIp(record)).$promise.then(function(data) {
			$scope.rs.push(data);
			if (data.Pos > $scope.idRange.tid) {
				$scope.idRange.tid = data.Pos;
			}
			if (data.Pos < $scope.idRange.bid) {
				$scope.idRange.bid = data.Pos;
			}
			PosFn.xpos(record, data);
		});
	}

	//candidates
	$scope.copyFromForm = function(record) {
		$scope.edit(new FormResource(copy(record)));
	};

	//isFields
	$scope.mfsTreeOptions = {
		/*jshint unused:false */
		accept : function(sourceNodeScope, destNodesScope, destIndex) {
			if (destNodesScope.nodrop || destNodesScope.outOfDepth(sourceNodeScope)) {
				return false;
			}

			if ($scope.mfs.indexOf(sourceNodeScope.$modelValue) > -1) {
				return true;
			}
			return false;
		},
		dropped : function(event) {
			if (!$scope.__rs) {
				return;
			}
			//mfs.field >>> rs.field
			if (event.dest.nodesScope.$modelValue === $scope.__rs) {
				$scope.mfs.push(copy(event.source.nodeScope.$modelValue));
			}

			var rs = $scope.rs;
			var bottom = rs[rs.length - 1].Pos;
			var top = isFirstPage() ? -1 : rs[0].Pos;
			if (!CpsService.averagePos($scope.__rs, bottom, top)) {
				Msg.pop('rsFull');
			}
		}
	};

	$scope.rsTreeOptions = {
		/*jshint unused:false */
		accept : function(sourceNodeScope, destNodesScope, destIndex) {
			if (destNodesScope.nodrop || destNodesScope.outOfDepth(sourceNodeScope)) {
				return false;
			}

			var rs = $scope.rs;

			if (destNodesScope.$modelValue.length >= rs[0].Pos - rs[rs.length - 1].Pos + 1) {
				$scope.__isFull = true;
				if ($scope.__rs.indexOf(sourceNodeScope.$modelValue) > -1) {
					return true;
				}
				Msg.pop('rsFull');
				return false;
			} else {
				$scope.__isFull = false;
			}

			return true;
		},
		/*jshint unused:false */
		dropped : function(event) {
			if (!$scope.__rs) {
				return;
			}
			var rs = $scope.rs;
			var bottom = rs[rs.length - 1].Pos;
			var top = isFirstPage() ? -1 : rs[0].Pos;
			if (!CpsService.averagePos($scope.__rs, bottom, top)) {
				Msg.pop('rsFull');
			}
		}
	};

	$scope.shouldCreate = function(record) {
		return !ArrFn.containsName($scope.rs, record);
	};

	$scope.shouldDelete = function(record) {
		return !ArrFn.containsName($scope.mfs, record);
	};

	$scope.removeUnexpected = function() {
		if ($scope._rs) {
			return;
		}

		var removes = ArrFn.diffName($scope.rs, $scope.mfs);
		var ids = removes.map(function(r) {
			return r.Id;
		});
		remoteAction({
			stopWhen : removes.length === 0,
			stopPop : 'zeroRemoves',
			act : 'remove',
			postData : {
				Ids : ids
			},
			handle : function() {
				$scope.rs = ArrFn.intersectName($scope.rs, $scope.mfs);
				if (ArrFn.containsId(removes, $scope.record)) {
					$scope.edit();
				}
			}
		});
	};

	$scope.posTop = function(iNow) {
		var record = $scope.rs[iNow];
		remoteAction({
			stopWhen : iNow === 0 && isFirstPage(),
			stopPop : 'alreadyTop',
			act : 'posTop',
			postData : PosFn.newIp(record),
			param : {
				search : CpsService.pSearch(record)
			},
			handle : function(data) {
				record.Pos = data.Pos;
				removeRecord(record, isFirstPage());
			}
		});
	};

	$scope.posBottom = function(iNow) {
		var record = $scope.rs[iNow];
		remoteAction({
			stopWhen : iNow === $scope.rs.length - 1 && isLastPage(),
			stopPop : 'alreadyBottom',
			act : 'posBottom',
			postData : PosFn.newIp(record),
			param : {
				search : CpsService.pSearch(record)
			},
			handle : function(data) {
				removeRecord(record, isLastPage());
				return data;
			}
		});
	};

	$scope.posUp = function(iNow) {
		simpleAction({
			stopWhen : iNow === 0 && isFirstPage(),
			stopPop : 'alreadyTop',
			act : 'posUp',
			handle : function() {
				return iNow === 0 ? posUpSingle(iNow) : xpos(iNow, iNow - 1);
			}
		});
	};

	$scope.posDown = function(iNow) {
		simpleAction({
			stopWhen : iNow === $scope.rs.length - 1 && isLastPage(),
			stopPop : 'alreadyBottom',
			act : 'posDown',
			handle : function() {
				return (iNow === $scope.rs.length - 1) ? posUpSingle(iNow, true) : xpos(iNow, iNow + 1);
			}
		});
	};

	$scope.copyInsert = function(record) {
		var copy = $scope.newRecord(record);
		copy.Pos = record.Pos;
		$scope.edit(copy);
	};

	$scope.insert = function(record) {
		var r = $scope.newRecord();
		r.Pos = record.Pos;
		$scope.edit(r);
	};

	$scope.removeNode = function(scope) {
		remoteAction({
			pre : function() {
				if (isUndefined(scope.$modelValue.Id)) {
					scope.remove();
					return $q.reject({
						succeed : true
					});
				}
			},
			act : 'remove',
			postData : {
				Ids : [scope.$modelValue.Id]
			},
			handle : function() {
				var id = scope.$modelValue.Id;
				scope.remove();
				if (id === $scope.record.Id) {
					$scope.edit();
				}
			}
		});
	};

	//return a new Resource instance
	$scope.newRecord = function(from) {
		var New = from || ($scope.form || {}).New || {};
		New = JsonFn.filterExample(New);
		New.Pos = -1;
		return new FormResource(New);
	};

	$scope.page = function() {
		remoteAction({
			act : 'page',
			param : {
				size : $scope.pager.itemsPerPage,
				num : $scope.pager.currentPage,
				search : $location.search()
			},
			handle : function(data, getResponseHeaders) {
				$scope.rs = data;
				$scope.pager.totalItems = parseInt(getResponseHeaders('X-Total-Items'));
				$scope.pager.currentPage = parseInt(getResponseHeaders('X-Page'));
				$scope.pager.itemsPerPage = parseInt(getResponseHeaders('X-Page-Size'));
				$scope.pageTop = PosFn.newIp(isFirstPage() ? -1 : $scope.rs[0]);
				$scope.pageBottom = PosFn.newIp($scope.rs[$scope.rs.length - 1]);
				$scope.idRange = {
					bid : $scope.pageBottom.Id,
					tid : $scope.pageTop
				};
				$scope.edit();
			}
		});
	};

	$scope.edit = function(record) {
		$scope.record = record || $scope.newRecord();
		// ugly fix date fmt problem
		angular.forEach($scope.form.Fields, function(field) {
			if (field.Type === 'datetime-local') {
				var name = field.Name;
//				$scope.record[name] = new Date($scope.record[name]);
			}
		});
		$scope.editing = copy($scope.record);
	};

	$scope.saveBatch = function() {
		remoteAction({
			act : 'saveAll',
			postData : $scope._rs,
			handle : function(data) {
				$scope.rs = $scope.__rs;
				delete $scope.__rs;
				$scope.__isFull = false;
				return data;
			}
		});
	};

	$scope.startBatch = function() {
		$scope.__rs = copy($scope.rs);
	};

	$scope.cancelBatch = function() {
		simpleAction({
			act : 'cancelBatch',
			handle : function() {
				delete $scope.__rs;
				$scope.__isFull = false;
			}
		});
	};

	//for new record with Pos
	$scope.saveUp = function() {
		simpleAction({
			act : 'saveUp',
			handle : function() {
				var newPos = CpsService.newPosUpTo($scope.rs, $scope.editing.Pos, $scope.pageBottom.Pos, $scope.pageTop.Pos);
				return saveWithnewPosWithoutShow(newPos);
			}
		});
	};

	$scope.saveNormal = function() {
		simpleAction({
			act : 'save',
			handle : saveNormal
		});
	};

	$scope.save = function() {
		if ($scope._rs) {
			copy($scope.editing, $scope.record);
			return;
		}

		if ($scope.hasPos && isEditNew()) {
			$scope.saveUp();
			return;
		}
		$scope.saveNormal();
	};

	$scope.remove = function() {
		if ($scope._rs) {
			if (isUndefined($scope.editing.Id)) {
				$scope.rs.remove($scope.record);
				$scope.edit();
			}
			return;
		}

		remoteAction({
			act : 'remove',
			postData : {
				Ids : [$scope.editing.Id]
			},
			handle : function() {
				$scope.rs.remove($scope.record);
				$scope.edit();
			}
		});
	};

	$scope.rearrange = function() {
		remoteAction({
			act : 'rearrange',
			param : {
				search : $location.search()
			},
			postData : $scope.idRange
		});
	};

	$scope.recovery = function() {
		remoteAction({
			act : 'recovery',
			handle : function() {
				$scope.rs = [];
				$scope.edit();
			}
		});
	};

	$scope.migrate = function() {
		remoteAction({
			act : 'migrate'
		});
	};

	//init page data
	FormResource.form(function(data) {
		$scope.form = data;
		$scope.hasPos = hasPos();
		if (!$scope.editing) {
			$scope.edit();
		}
	});

	if ($scope.isFields) {

		$scope.pager.itemsPerPage = 200;

		var promise = FormResource.mfs().$promise.then(function(data) {
			$scope.mfs = data;

			$scope.$watchCollection('rs', function(newValue, oldValue, scope) {
				scope.candidates = ArrFn.diffName($scope.mfs, $scope.rs);
			});
		});
		Msg.end.call(promise, 'mfs');
	}

	$scope.$watchCollection('rs', function(newValue, oldValue, scope) {
		if (Array.isArray(scope.rs) && scope.hasPos) {
			scope.rs.sort(PosFn.desc);
		}
	});

	$scope.$watch('record.Pos', function() {
		if (isDefined($scope.editing) && isDefined($scope.record)) {
			$scope.editing.Pos = $scope.record.Pos;
		}
	});

	$scope.page();

	$scope.template = function(name) {
		return '/views/directive-templates/form/' + name + '.html'
	};

}]).directive('formDirective', ['$routeParams',
function($routeParams) {
	return {
		controller : 'FormDirectiveCtrl',
		/*jshint unused:false */
		templateUrl : function(elem, attr) {
			var fname = $routeParams.fname;
			var prefix = '';
			switch (fname) {
				case 'Field':
					prefix = fname + '-';
			}
			return '/views/directive-templates/form/' + prefix + 'form.html';
		},
		restrict : 'E',
		scope : {
			ops : '='
		}
	};
}]);
