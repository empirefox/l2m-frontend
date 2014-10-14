'use strict';

angularApp.service('ParentsSession', function() {
}).controller('FormDirectiveCtrl', ['$scope', '$http', 'ParentsSession',
function($scope, $http, ParentsSession) {
	function delGoNullTime(key, value) {
		if (/^0001-01-01T(\d{2}):(\d{2}):(\d{2}).*$/.test(value)) {
			return undefined;
		}
		return value;
	}

	//监视parent,改变后重新载入

	$scope.$watch('parent', /*jshint unused:false */
	function(value) {
		delete $scope.pager;
		$scope.load();
	});

	$scope.parent = ParentsSession[$scope.form.Name];
	if (angular.isDefined($scope.parent)) {
		delete ParentsSession[$scope.form.Name];
	}
	$scope.isDefined = angular.isDefined;
	$scope.newRecord = function() {
		var New = $scope.form.New;
		if (angular.isUndefined(New)) {
			return {
				isNew : true
			};
		}
		var r = JSON.parse(JSON.stringify(New, delGoNullTime));
		r.isNew = true;
		return r;
	};
	$scope.ops.load && ($scope.load = function() {
		if (angular.isUndefined($scope.pager)) {
			$scope.pager = {
				maxSize : 5,
				totalItems : 0,
				itemsPerPage : 20,
				currentPage : 1
			};
		}
		$http.get($scope.ops.load, {
			params : {
				size : $scope.pager.itemsPerPage,
				num : $scope.pager.currentPage,
				parent : angular.isDefined($scope.parent) ? $scope.parent.Id : 'null'
			}
		}).success(function(data) {
			data = JSON.parse(JSON.stringify(data, delGoNullTime));
			//content: list, page_count, total
			$scope.rs = data.content.list;
			$scope.pager.totalItems = data.content.total;
			$scope.alert = {
				type : 'success',
				msg : '载入完毕'
			};
			$scope.edit($scope.newRecord());
		});
	});
	$scope.edit = function(record) {
		$scope.record = record;
		$scope.editing = JSON.parse(JSON.stringify(record));
	};
	$scope.reset = function() {
		$scope.editing = JSON.parse(JSON.stringify($scope.record));
	};
	$scope.ops.save && ($scope.save = function() {
		$http.post($scope.ops.save, $scope.editing).success(function(data) {
			if (data.error) {
				$scope.alert = {
					type : 'error',
					msg : data.content
				};
			} else {
				if ($scope.editing.isNew) {
					$scope.rs.push(data.content);
					$scope.edit(data.content);
				} else {
					$scope.rs.replace($scope.record, data.content);
					$scope.record = data.content;
					$scope.reset();
				}
				$scope.alert = {
					type : 'success',
					msg : '保存成功'
				};
			}
		});
	});
	$scope.ops.remove && ($scope.remove = function() {
		$http.post($scope.ops.remove, $scope.editing).success(function(data) {
			if (data.error) {
				$scope.alert = {
					type : 'error',
					msg : data.content
				};
			} else {
				$scope.rs.remove($scope.record);
				$scope.edit($scope.newRecord());
				$scope.alert = {
					type : 'success',
					msg : '删除成功'
				};
			}
		});
	});
	$scope.ops.recovery && ($scope.recovery = function() {
		$http.put($scope.ops.recovery, {}).success(function(data) {
			if (data.error) {
				$scope.alert = {
					type : 'error',
					msg : data.content
				};
			} else {
				$scope.alert = {
					type : 'success',
					msg : '重建数据库成功，当前所有数据在服务器端已经被删除,点击载入按钮重新加载'
				};
			}
		});
	});
	$scope.ops.migrate && ($scope.migrate = function() {
		$http.put($scope.ops.migrate, {}).success(function(data) {
			if (data.error) {
				$scope.alert = {
					type : 'error',
					msg : data.content
				};
			} else {
				$scope.alert = {
					type : 'success',
					msg : '数据库结构更新成功,刷新页面重新加载相应结构'
				};
			}
		});
	});
}]).directive('formDirective', function() {
	return {
		controller : 'FormDirectiveCtrl',
		templateUrl : 'views/directive-templates/form/form.html',
		restrict : 'E',
		scope : {
			form : '=formMetas',
			ops : '='
		}
	};
});
