const utils = require('keystone-utils');

/**
 * Path Class
 */

export default function Path (str) {

	if (!(this instanceof Path)) {
		return new Path(str);
	}

	const parts = this.parts = str.split('.');
	const last = this.parts[this.parts.length - 1];

	this.addTo = function (obj, val) {
		let o = obj;
		for (let i = 0; i < parts.length - 1; i++) {
			if (!utils.isObject(o[parts[i]])) {
				o[parts[i]] = {};
			}
			o = o[parts[i]];
		}
		o[last] = val;
		return obj;
	};

	this.get = function (obj, subpath) {
		if (typeof obj !== 'object') throw new TypeError('Path.get: obj argument must be an Object');
		let i;
		if (subpath) {
			const nested = subpath.charAt(0) === '.';
			const flatPath = str + subpath;
			if (flatPath in obj) {
				return obj[flatPath];
			}
			for (i = 0; i < parts.length - (nested ? 0 : 1); i++) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[parts[i]];
			}
			if (nested) {
				subpath = subpath.substr(1);
			} else {
				subpath = last + subpath;
			}
			return (typeof obj === 'object') ? obj[subpath] : undefined;
		} else if (str in obj) {
			return obj[str];
		} else {
			for (i = 0; i < parts.length; i++) {
				if (typeof obj !== 'object') return undefined;
				obj = obj[parts[i]];
			}
			return obj;
		}
	};

	return this;

}
