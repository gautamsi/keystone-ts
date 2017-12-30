const FieldType = require('../Type');
const util = require('util');
const utils = require('keystone-utils');

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
export function text (list, path, options) {
	this.options = options;
	this._nativeType = String;
	this._properties = ['monospace'];
	this._underscoreMethods = ['crop'];
	text.super_.call(this, list, path, options);
}
text.properName = 'Text';
util.inherits(text, FieldType);

text.prototype.validateInput = function (data, callback) {
	const max = this.options.max;
	const min = this.options.min;
	const value = this.getValueFromData(data);
	let result = value === undefined || value === null || typeof value === 'string';
	if (max && typeof value === 'string') {
		result = value.length < max;
	}
	if (min && typeof value === 'string') {
		result = value.length > min;
	}
	utils.defer(callback, result);
};

text.prototype.validateRequiredInput = function (item, data, callback) {
	const value = this.getValueFromData(data);
	let result = !!value;
	if (value === undefined && item.get(this.path)) {
		result = true;
	}
	utils.defer(callback, result);
};

/**
 * Add filters to a query
 */
text.prototype.addFilterToQuery = function (filter) {
	const query = {};
	if (filter.mode === 'exactly' && !filter.value) {
		query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
		return query;
	}
	let value = utils.escapeRegExp(filter.value);
	if (filter.mode === 'beginsWith') {
		value = '^' + value;
	} else if (filter.mode === 'endsWith') {
		value = value + '$';
	} else if (filter.mode === 'exactly') {
		value = '^' + value + '$';
	}
	value = new RegExp(value, filter.caseSensitive ? '' : 'i');
	query[this.path] = filter.inverted ? { $not: value } : value;
	return query;
};

/**
 * Crops the string to the specifed length.
 */
text.prototype.crop = function (item, length, append, preserveWords) {
	return utils.cropString(item.get(this.path), length, append, preserveWords);
};
