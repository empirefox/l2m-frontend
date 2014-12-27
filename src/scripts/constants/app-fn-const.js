angular.module('app.fns', []).constant('ArrFn', ( function() {
		var isDefined = angular.isDefined;
		var ArrFn = {
			isOutOfFn : function(container) {
				return function(ele) {
					return container.indexOf(ele) < 0;
				};
			},

			// -1 when not found, -2 when not found and pos is the biggest one
			findIndexByPos : function(container, pos) {
				container = container || [];
				var index = -1,
				    isBiggest = true;
				container.some(function(ele, i) {
					isBiggest = isBiggest && pos > ele.Pos;
					if (ele.Pos === pos) {
						index = i;
						return true;
					}
					return false;
				});
				return (index === -1 && isBiggest) ? -2 : index;
			},

			containsWithProperty : function(container, target, propName) {
				container = container || [];
				return container.some(function(ele) {
					if (isDefined(propName)) {
						return ele[propName] === target[propName];
					}
					return ele === target;
				});
			},

			// namesInFn
			pick : function(all, fn, from) {
				return all.filter(fn(from, true));
			},

			// namesInFn
			drop : function(all, fn, from) {
				return all.filter(fn(from, false));
			}
		};

		ArrFn.equals = function(a1, a2) {
			a1 = a1 || [];
			a2 = a2 || [];
			if (a1.length === 0 && a2.length === 0) {
				return true;
			}
			if (a1.length !== a2.length) {
				return false;
			}
			return !(a1.some(ArrFn.isOutOfFn(a2)) || a2.some(ArrFn.isOutOfFn(a1)));
		};

		ArrFn.containsName = function(container, target) {
			return ArrFn.containsWithProperty(container, target, 'Name');
		};

		ArrFn.containsId = function(container, target) {
			return ArrFn.containsWithProperty(container, target, 'Id');
		};

		ArrFn.namesInFn = function(arr, within) {
			return function(v) {
				var has = ArrFn.containsName(arr, v);
				return within ? has : !has;
			};
		};

		ArrFn.diffName = function(all, from) {
			return all.filter(ArrFn.namesInFn(from, false));
		};

		ArrFn.intersectName = function(all, from) {
			return all.filter(ArrFn.namesInFn(from, true));
		};

		ArrFn.remove = function(arr, target) {
			var index = arr.indexOf(target);
			if (index > -1) {
				arr.splice(index, 1);
			}
		};

		ArrFn.replace = function(arr, target, rep) {
			var index = arr.indexOf(target);
			if (index > -1) {
				arr[index] = rep;
			}
		};
		return ArrFn;
	}())).constant('PosFn', {
	desc : function(a, b) {
		return +(b.Pos || 0) - (a.Pos || 0);
	},

	orderByFn : function(ascs, descs) {
		ascs = ascs || [];
		descs = descs || [];
		return function(a, b) {
			var result = 0;
			/*jshint eqnull:true */
			var ok = ascs.some(function(asc) {
				var va = a[asc],
				    vb = b[asc];
				/*jslint eqeq: true*/
				if (va == vb) {
					return false;
				}
				if (vb == null || va > vb) {
					result = 1;
					return true;
				}
				if (va == null || va < vb) {
					result = -1;
					return true;
				}
			});
			if (ok) {
				return result;
			}
			/*jshint eqnull:true */
			descs.some(function(desc) {
				var va = a[desc],
				    vb = b[desc];
				/*jslint eqeq: true*/
				if (va == vb) {
					return false;
				}
				if (vb == null || va > vb) {
					result = -1;
					return true;
				}
				if (va == null || va < vb) {
					result = 1;
					return true;
				}
			});
			return result;
		};
	},

	isIps : function(data) {
		var $regex = /^\$/;
		if (Array.isArray(data) && data.length > 0) {
			var keys = Object.keys(data[0]).filter(function(k) {
				return !$regex.test(k);
			}).sort().join('');
			return 'IdPos' === keys;
		}
		return false;
	},

	newIp : function(data) {
		if (data === -1) {
			return {
				Id : -1,
				Pos : -1
			};
		}
		return {
			Id : data.Id,
			Pos : data.Pos
		};
	},

	xpos : function(ip1, ip2) {
		var temp = ip1.Pos;
		ip1.Pos = ip2.Pos;
		ip2.Pos = temp;
	}
}).constant('JsonFn', ( function() {
		var JsonFn = {
			delGoNullTime : function(key, value) {
				if (/^0001-01-01T(\d{2}):(\d{2}):(\d{2}).*$/.test(value)) {
					return undefined;
				}
				return value;
			}
		};
		JsonFn.delNoneExampleEntry = function(key, value) {
			var eq = 'id|pos|createdat|created_at|updatedat|updated_at'.split('|').some(function(e) {
				return typeof key === 'string' && key.toLowerCase() === e;
			});
			return eq ? undefined : JsonFn.delGoNullTime(key, value);
		};
		JsonFn.filterExample = function(obj) {
			return JSON.parse(JSON.stringify(obj, JsonFn.delNoneExampleEntry));
		};
		return JsonFn;
	}())).constant('TplFn', ( function() {
		var baseDir = '/views/directive-templates/';
		var fieldBaseDir = baseDir + 'field/';
		var formBaseDir = baseDir + 'form/';
		var TplFn = {
			fieldBaseDir : fieldBaseDir,
			formBaseDir : formBaseDir,

			field : function(type) {
				switch(type) {
					case 'codemirror':
					case 'text-angular':
					case 'number':
					case 'textarea':
					case 'checkbox':
					case 'hidden':
					case 'radio':
					case 'kindeditor':
					case 'parent':
					case 'children':
					case 'timepicker':
					case 'datetimepicker':
						return fieldBaseDir + type + '.html';
					case 'datepicker':
					case 'monthpicker':
					case 'yearpicker':
						return fieldBaseDir + 'datepicker.html';
					case 'text':
					case 'textfield':
					case 'search':
					case 'url':
					case 'telephone':
					case 'email':
					case 'password':
					//ng额外
					case 'date':
					case 'datetime-local':
					case 'month':
					case 'time':
					case 'week':
						return fieldBaseDir + 'textfield.html';
					default:
						return fieldBaseDir + 'textfield.html';
				}
				return '';
			},

			formFragment : function(name) {
				return formBaseDir + name + '.html';
			}
		};
		return TplFn;
	}()));
