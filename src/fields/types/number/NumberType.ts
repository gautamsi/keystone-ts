import { FieldTypeBase } from '../FieldTypeBase';
import * as numeral from 'numeral';
import * as utils from 'keystone-utils';

/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */
export class NumberType extends FieldTypeBase {
    formatString: string;

    get _underscoreMethods() {
        return ['format'];
    }

    constructor(list, path, options) {
        super(list, path, options, Number);
        // this._nativeType = Number;
        this._fixedSize = 'small';
        // this._underscoreMethods = ['format'];
        this.formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
        if (this.formatString && typeof this.formatString !== 'string') {
            throw new Error('FieldType.Number: options.format must be a string.');
        }
    }
    static properName = 'Number';

    validateInput(data, callback) {
        let value = this.getValueFromData(data);
        let result = value === undefined || typeof value === 'number' || value === null;
        if (typeof value === 'string') {
            if (value === '') {
                result = true;
            } else {
                value = utils.number(value);
                result = !isNaN(value);
            }
        }
        utils.defer(callback, result);
    }

    validateRequiredInput(item, data, callback) {
        const value = this.getValueFromData(data);
        let result = !!(value || typeof value === 'number');
        if (value === undefined && item.get(this.path)) {
            result = true;
        }
        utils.defer(callback, result);
    }

    /**
     * Add filters to a query
     */
    addFilterToQuery(filter) {
        const query: any = {};
        if (filter.mode === 'equals' && !filter.value) {
            query[this.path] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
            return query;
        }
        if (filter.mode === 'between') {
            const min = utils.number(filter.value.min);
            const max = utils.number(filter.value.max);
            if (!isNaN(min) && !isNaN(max)) {
                if (filter.inverted) {
                    const gte = {}; gte[this.path] = { $gt: max };
                    const lte = {}; lte[this.path] = { $lt: min };
                    query.$or = [gte, lte];
                } else {
                    query[this.path] = { $gte: min, $lte: max };
                }
            }
            return query;
        }
        const value = utils.number(filter.value);
        if (!isNaN(value)) {
            if (filter.mode === 'gt') {
                query[this.path] = filter.inverted ? { $lt: value } : { $gt: value };
            }
            else if (filter.mode === 'lt') {
                query[this.path] = filter.inverted ? { $gt: value } : { $lt: value };
            }
            else {
                query[this.path] = filter.inverted ? { $ne: value } : value;
            }
        }
        return query;
    }

    /**
     * Formats the field value
     */
    format(item, format) {
        const value = item.get(this.path);
        if (format || this.formatString) {
            return (typeof value === 'number') ? numeral(value).format(format || this.formatString) : '';
        } else {
            return value || value === 0 ? String(value) : '';
        }
    }

    /**
     * Checks that a valid number has been provided in a data object
     * An empty value clears the stored value and is considered valid
     *
     * Deprecated
     */
    inputIsValid(data, required, item) {
        const value = this.getValueFromData(data);
        if (value === undefined && item && (item.get(this.path) || item.get(this.path) === 0)) {
            return true;
        }
        if (value !== undefined && value !== '') {
            const newValue = utils.number(value);
            return (!isNaN(newValue));
        } else {
            return (required) ? false : true;
        }
    }

    /**
     * Updates the value for this field in the item from a data object
     */
    updateItem(item, data, callback) {
        const value = this.getValueFromData(data);
        if (value === undefined) {
            return process.nextTick(callback);
        }
        const newValue = utils.number(value);
        if (!isNaN(newValue)) {
            if (newValue !== item.get(this.path)) {
                item.set(this.path, newValue);
            }
        } else if (typeof item.get(this.path) === 'number') {
            item.set(this.path, null);
        }
        process.nextTick(callback);
    }
}
