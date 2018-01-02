import * as _ from 'lodash';
import { FieldTypeBase } from '../FieldTypeBase';
import * as utils from 'keystone-utils';
import * as displayName from 'display-name';

/**
 * Name FieldType Constructor
 * @extends Field
 * @api public
 */
export class NameType extends FieldTypeBase {
    paths: any;

    constructor(list, path, options) {
        super(list, path, options);
        this._fixedSize = 'full';
        options.default = { first: '', last: '' };
    }
    static properName = 'Name';

    /**
     * Registers the field on the List's Mongoose Schema.
     *
     * Adds String properties for .first and .last name, and a virtual
     * with get() and set() methods for .full
     *
     * @api public
     */
    addToSchema(schema) {
        const paths = this.paths = {
            first: this.path + '.first',
            last: this.path + '.last',
            full: this.path + '.full',
        };

        schema.nested[this.path] = true;
        schema.add({
            first: String,
            last: String,
        }, this.path + '.');

        schema.virtual(paths.full).get(function () {
            return displayName(this.get(paths.first), this.get(paths.last));
        });

        schema.virtual(paths.full).set(function (value) {
            if (typeof value !== 'string') {
                this.set(paths.first, undefined);
                this.set(paths.last, undefined);
                return;
            }
            const split = value.split(' ');
            this.set(paths.first, split.shift());
            this.set(paths.last, split.join(' ') || undefined);
        });

        this.bindUnderscoreMethods();
    }

    /**
     * Gets the string to use for sorting by this field
     */
    getSortString(options) {
        if (options.invert) {
            return '-' + this.paths.first + ' -' + this.paths.last;
        }
        return this.paths.first + ' ' + this.paths.last;
    }

    /**
     * Add filters to a query
     */
    addFilterToQuery(filter) {
        const query: any = {};
        if (filter.mode === 'exactly' && !filter.value) {
            query[this.paths.first] = query[this.paths.last] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
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
        if (filter.inverted) {
            query[this.paths.first] = query[this.paths.last] = { $not: value };
        } else {
            const first = {}; first[this.paths.first] = value;
            const last = {}; last[this.paths.last] = value;
            query.$or = [first, last];
        }
        return query;
    }

    /**
     * Formats the field value
     */

    format(item) {
        return item.get(this.paths.full);
    }

    /**
     * Get the value from a data object; may be simple or a pair of fields
     */
    getInputFromData(data) {
        // this.getValueFromData throws an error if we pass name: null
        if (data[this.path] === null) {
            return null;
        }
        let first = this.getValueFromData(data, '_first');
        if (first === undefined) first = this.getValueFromData(data, '.first');
        let last = this.getValueFromData(data, '_last');
        if (last === undefined) last = this.getValueFromData(data, '.last');
        if (first !== undefined || last !== undefined) {
            return {
                first: first,
                last: last,
            };
        }
        return this.getValueFromData(data) || this.getValueFromData(data, '.full');
    }

    /**
     * Validates that a value for this field has been provided in a data object
     */
    validateInput(data, callback) {
        const value = this.getInputFromData(data);
        const result = value === undefined
            || value === null
            || typeof value === 'string'
            || (typeof value === 'object' && (
                typeof value.first === 'string'
                || value.first === null
                || typeof value.last === 'string'
                || value.last === null)
            );
        utils.defer(callback, result);
    }

    /**
     * Validates that input has been provided
     */
    validateRequiredInput(item, data, callback) {
        const value = this.getInputFromData(data);
        let result;
        if (value === null) {
            result = false;
        } else {
            result = (
                typeof value === 'string' && value.length
                || typeof value === 'object' && (
                    typeof value.first === 'string' && value.first.length
                    || typeof value.last === 'string' && value.last.length)
                || (item.get(this.paths.full)
                    || item.get(this.paths.first)
                    || item.get(this.paths.last)) && (
                    value === undefined
                    || (value.first === undefined
                        && value.last === undefined))
            ) ? true : false;
        }
        utils.defer(callback, result);
    }

    /**
     * Validates that a value for this field has been provided in a data object
     *
     * Deprecated
     */
    inputIsValid(data, required, item) {
        // Input is valid if none was provided, but the item has data
        if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item && item.get(this.paths.full)) return true;
        // Input is valid if the field is not required
        if (!required) return true;
        // Otherwise check for valid strings in the provided data,
        // which may be nested or use flattened paths.
        if (_.isObject(data[this.path])) {
            return (data[this.path].full || data[this.path].first || data[this.path].last) ? true : false;
        } else {
            return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
        }
    }

    /**
     * Detects whether the field has been modified
     *
     * @api public
     */
    isModified(item) {
        return item.isModified(this.paths.first) || item.isModified(this.paths.last);
    }

    /**
     * Updates the value for this field in the item from a data object
     *
     * @api public
     */
    updateItem(item, data, callback) {
        const paths = this.paths;
        const value = this.getInputFromData(data);
        if (typeof value === 'string' || value === null) {
            item.set(paths.full, value);
        } else if (typeof value === 'object') {
            if (typeof value.first === 'string' || value.first === null) {
                item.set(paths.first, value.first);
            }
            if (typeof value.last === 'string' || value.last === null) {
                item.set(paths.last, value.last);
            }
        }
        process.nextTick(callback);
    }
}
