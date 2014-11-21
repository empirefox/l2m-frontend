angular.module('app.fns', []).constant('ArrFn', {

	equals : function(a1, a2) {
		a1 = a1 || [];
		a2 = a2 || [];
		return !(a1.some(this.isOutOfFn(a2)) || a2.some(this.isOutOfFn(a1)));
	},

	isOutOfFn : function(container) {
		return function(ele) {
			return container.indexOf(ele) < 0;
		};
	},

	findIndexByPos : function(container, pos) {
		container = container || [];
		var index = -2;
		container.some(function(ele, i) {
			if (ele.Pos === pos) {
				index = i;
				return true;
			}
			return false;
		});
		return index;
	},

	containsWithProperty : function(container, target, propName) {
		container = container || [];
		return container.some(function(ele) {
			if (angular.isDefined(propName)) {
				return ele[propName] === target[propName];
			}
			return ele === target;
		});
	},

	containsName : function(container, target) {
		return this.containsWithProperty(container, target, 'Name');
	},

	containsId : function(container, target) {
		return this.containsWithProperty(container, target, 'Id');
	},

	namesInFn : function(arr, within) {
		var ArrFn = this;
		return function(v) {
			var has = ArrFn.containsName(arr, v);
			return within ? has : !has;
		};
	},

	// namesInFn
	pick : function(all, fn, from) {
		return all.filter(fn(from, true));
	},

	// namesInFn
	drop : function(all, fn, from) {
		return all.filter(fn(from, false));
	},

	diffName : function(all, from) {
		return this.drop(all, this.namesInFn.bind(this), from);
	},

	intersectName : function(all, from) {
		return this.pick(all, this.namesInFn.bind(this), from);
	}
}).constant('PosFn', {
	desc : function(a, b) {
		return b.Pos - a.Pos;
	},

	isIps : function(data) {
		return Array.isArray(data) && data.length > 0 && ArrFn.equals(data[0].keys(), ['Ip', 'Pos']);
	},

	NewIp : function(data) {
		if (data === -1) {
			return {
				Id : -1,
				Pos : -1
			}
		}
		return {
			Id : data.Id,
			Pos : data.Pos
		};
	}
}).constant('JsonFn', {
	delGoNullTime : function(key, value) {
		if (/^0001-01-01T(\d{2}):(\d{2}):(\d{2}).*$/.test(value)) {
			return undefined;
		}
		return value;
	},

	delNoneExampleEntry : function(key, value) {
		var eq = 'id|pos|createdat|created_at|updatedat|updated_at'.split('|').some(function(e) {
			return typeof key === 'string' && key.toLowerCase() === e;
		});
		return eq ? undefined : this.delGoNullTime(key, value);
	}
});