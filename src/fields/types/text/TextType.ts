import { FieldTypeBase } from '../FieldTypeBase';
import * as util from 'util';
import * as utils from 'keystone-utils';

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
export class TextType extends FieldTypeBase {

    get _underscoreMethods() {
        return ['crop'];
    }

    constructor(list, path, options) {
        super(list, path, options, String);
        this._properties = ['monospace'];
        // this._underscoreMethods = ['crop'];
    }
    static properName = 'Text';

    validateInput(data, callback) {
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
    }

    validateRequiredInput(item, data, callback) {
        const value = this.getValueFromData(data);
        let result = !!value;
        if (value === undefined && item.get(this.path)) {
            result = true;
        }
        utils.defer(callback, result);
    }

    /**
     * Add filters to a query
     */
    addFilterToQuery(filter) {
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
    }

    /**
     * Crops the string to the specifed length.
     */
    crop(item, length, append, preserveWords) {
        return utils.cropString(item.get(this.path), length, append, preserveWords);
    }
}
