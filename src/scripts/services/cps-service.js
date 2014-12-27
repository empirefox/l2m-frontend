//MUST one-one with Server!!!
//used by save up
angular.module('app.cps', ['ngRoute', 'app.fns']).constant('Cps', {

	Field : 'FormId'.split(','),
	Oauth : 'AccountId'.split(',')

}).service('CpsService', ['Cps', '$routeParams', '$location', 'ArrFn', 'PosFn',
function(Cps, $routeParams, $location, ArrFn, PosFn) {

	function newPosUpOnStep(models, iNow, step) {
		var iMax = models.length - 1;
		var iNext = iNow + step;
		// 向上超出
		if (iNext < 0) {
			// 预计下一步也超出
			if (iNow - step > iMax) {
				return -1;
			}
			return newPosUpOnStep(models, iNow, nextStep(step));
		}
		// 向下超出
		if (iNext > iMax) {
			// 预计下一步也超出
			if (iNow - step - 1 < 0) {
				return -1;
			}
			return newPosUpOnStep(models, iNow, nextStep(step));
		}
		// 本步不超出
		var pCheck = models[iNext].Pos;
		var pNow = models[iNow].Pos;

		// 找到处理终点
		var space = Math.abs(pNow - pCheck) - Math.abs(step);
		if (space > 0) {
			var mods = [];
			// 向上处理
			if (step < 0) {
				if (step === -1) {
					return Math.floor((pCheck + pNow) / 2);
				}
				for (var i = iNow - 1; i > iNext; i--) {
					mods.push({
						Id : models[i].Id,
						Pos : models[i].Pos + Math.floor(space / 2)
					});
					// need to save
				}
				return {
					Pos : pNow + Math.floor(space / 2),
					Mods : mods
				};
			}
			// 向下处理
			if (step === 1) {
				return Math.floor((pCheck + pNow) / 2);
			}
			for (var j = iNow; j < iNext; j++) {
				mods.push({
					Id : models[j].Id,
					Pos : models[j].Pos - Math.floor(space / 2)
				});
				// need to save
			}
			return {
				Pos : pNow,
				Mods : mods
			};
		}

		// 继续处理
		return newPosUpOnStep(models, iNow, nextStep(step));
	}

	function nextStep(step) {
		return step < 0 ? -step : -step - 1;
	}

	var cps = this;

	this.asFk = function() {
		return S($routeParams.fname).underscore().chompLeft('_').s + "_id";
	};

	this.getArray = function() {
		return Cps[$routeParams.fname] || [];
	};

	this.getString = function() {
		var arr = cps.getArray();
		if (arr.length > 0) {
			return arr.join();
		}
	};

	// length of models must be 3 at least
	// top == -1, means top is not limited
	// when the cap is full, false will be returned
	this.averagePos = function(models, bottom, top) {
		if (models.length < 3) {
			return true;
		}

		top = top || -1;
		if (top < 0) {
			for (var i = 0; i < models.length; i++) {
				models[models.length - 1 - i].Pos = 8 * i + bottom;
			}
			return true;
		}

		var section = (top - bottom) / (models.length - 1);
		if (section < 1) {
			return false;
		}
		for (var j = 0; j < models.length - 1; j++) {
			models[j].Pos = Math.floor(top - j * section);
		}
		models[models.length - 1].Pos = bottom;
		return true;
	};

	this.pSearch = function(record) {
		var ps;
		cps.getArray().forEach(function(p) {
			if (angular.isDefined(record[p])) {
				ps = ps || {};
				var pKey = S(p).underscore().chompLeft('_').s;
				ps[pKey] = record[p];
			}
		});
		return ps;
	};

	this.extract = function() {
		var search = $location.search(),
		    obj = {};
		cps.getArray().forEach(function(p) {
			var value = search[S(p).underscore().chompLeft('_').s];
			if (angular.isDefined(value)) {
				var sv = S(value);
				obj[p] = sv.isNumeric() ? sv.toInt() : value;
			}
		});
		return obj;
	};

	this.orderFn = function(hasPos) {
		return PosFn.orderByFn(cps.getArray(), hasPos ? ['Pos'] : undefined);
	};

	this.canSetPos = function() {
		var arr = cps.getArray().map(function(p) {
			return S(p).underscore().chompLeft('_').s;
		});
		var keys = Object.keys($location.search());
		return ArrFn.equals(arr, keys);
	};

	this.newPosUpTo = function(models, basePos, bottom, top) {
		if (!cps.canSetPos()) {
			return -1;
		}

		// 还没有元素
		if (!models || models.length === 0) {
			return angular.isDefined(bottom) ? bottom : -1;
		}

		bottom = angular.isDefined(bottom) ? bottom : models[models.length - 1].Pos;
		top = angular.isDefined(top) ? (top === -1 ? models[0].Pos + 16 : top) : models[0].Pos;

		// must use concat to generate a new array
		if (models[0].Pos < top) {
			models = [{
				Pos : top + 1
			}].concat(models);
		}

		if (models[models.length - 1].Pos > bottom) {
			models = models.concat([{
				Pos : bottom - 1
			}]);
		}

		// 取得基准位置
		var iNow = ArrFn.findIndexByPos(models, basePos);
		if (iNow < 0) {
			return basePos;
		}
		// 不能是最上面元素，需要排除0
		if (iNow < 1) {
			return -1;
		}
		// 开始时向上处理
		return newPosUpOnStep(models, iNow, -1);
	};

}]);
