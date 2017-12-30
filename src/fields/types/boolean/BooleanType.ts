const FieldType = require('../Type');
const utils = require('keystone-utils');
const util = require('util');

/**
 * Boolean FieldType Constructor
 * @extends Field
 * @api public
 */
export function boolean(list, path, options) {
    this._nativeType = Boolean;
    this._properties = ['indent'];
    this._fixedSize = 'full';
    this.indent = (options.indent) ? true : false;
    boolean['super_'].call(this, list, path, options);
}
boolean['properName'] = 'Boolean';
util.inherits(boolean, FieldType);

boolean.prototype.defaults = {
    default: false,
};

boolean.prototype.validateInput = function (data, callback) {
    const value = this.getValueFromData(data);
    let result = true;
    if (value !== undefined
        && value !== null
        && typeof value !== 'string'
        && typeof value !== 'number'
        && typeof value !== 'boolean') {
        result = false;
    }
    utils.defer(callback, result);
};

boolean.prototype.validateRequiredInput = function (item, data, callback) {
    const value = this.getValueFromData(data);
    const result = (value && value !== 'false') || item.get(this.path) ? true : false;
    utils.defer(callback, result);
};

/**
 * Add filters to a query
 */
boolean.prototype.addFilterToQuery = function (filter) {
    const query = {};
    if (!filter.value || filter.value === 'false') {
        query[this.path] = { $ne: true };
    } else {
        query[this.path] = true;
    }
    return query;
};

/**
 * Validates that a truthy value for this field has been provided in a data object.
 * Useful for checkboxes that are required to be true (e.g. agreed to terms and cond's)
 *
 * Deprecated
 */
boolean.prototype.inputIsValid = function (data, required) {
    if (required) {
        return (data[this.path] === true || data[this.path] === 'true') ? true : false;
    } else {
        return true;
    }
};

/**
 * Updates the value for this field in the item from a data object.
 * Only updates the value if it has changed.
 * Treats a falsy value or the string "false" as false, everything else as true.
 */
boolean.prototype.updateItem = function (item, data, callback) {
    const value = this.getValueFromData(data);
    if (typeof value === 'undefined') {
        return process.nextTick(callback);
    }
    if (!value || value === 'false') {
        if (item.get(this.path) !== false) {
            item.set(this.path, false);
        }
    } else if (!item.get(this.path)) {
        item.set(this.path, true);
    }
    process.nextTick(callback);
};
