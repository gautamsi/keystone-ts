import { FieldTypeBase } from '../FieldTypeBase';
import * as numeral from 'numeral';
import * as utils from 'keystone-utils';
import { addPresenceToQuery } from '../../utils/addPresenceToQuery';


/**
 * Checks if a value is a valid number
 */
function isValidNumber(value) {
    return !Number.isNaN(utils.number(value));
}
/**
 * Number FieldType Constructor
 * @extends Field
 * @api public
 */
export class NumberArrayType extends FieldTypeBase {
    separator: string;
    _formatString: string;

    constructor(list, path, options) {
        super(list, path, options);
    }
    protected init() {
        super.init();
        this._nativeType = [Number];
        this._underscoreMethods = ['format'];
        this._formatString = (this.options.format === false) ? false : (this.options.format || '0,0[.][000000000000]');
        this._defaultSize = 'small';
        if (this._formatString && typeof this._formatString !== 'string') {
            throw new Error('FieldType.NumberArray: options.format must be a string.');
        }
        this.separator = this.options.separator || ' | ';
    }
    static properName = 'NumberArray';

    /**
     * Formats the field value
     */
    format(item, format, separator) {
        let value = item.get(this.path);
        if (format || this._formatString) {
            value = value.map(function (n) {
                return numeral(n).format(format || this._formatString);
            });
        }
        return value.join(separator || this.separator);
    }


    /**
     * Asynchronously confirms that the provided value is valid
     */
    validateInput(data, callback) {
        let value = this.getValueFromData(data);
        let result = true;
        // Let undefined, empty string and null pass
        if (value !== undefined && value !== '' && value !== null) {
            // Coerce a single value to an array
            if (!Array.isArray(value)) {
                value = [value];
            }
            for (let i = 0; i < value.length; i++) {
                let thisValue = value[i];
                // If it's a string, check if there's a number in the string
                if (typeof thisValue === 'string') {
                    thisValue = utils.number(thisValue);
                }
                // If it's not a number or NaN invalidate
                if (typeof thisValue !== 'number' || Number.isNaN(thisValue)) {
                    result = false;
                    break;
                }
            }
        }
        utils.defer(callback, result);
    }

    /**
     * Asynchronously confirms that the a value is present
     */
    validateRequiredInput(item, data, callback) {
        const value = this.getValueFromData(data);
        let result = false;
        // If the field is undefined but has a value saved already, validate
        if (value === undefined) {
            if (item.get(this.path) && item.get(this.path).length) {
                result = true;
            }
        }
        // If it's a string that's not empty, validate
        if (typeof value === 'string' && value !== '') {
            result = true;
            // If it's an array of only numbers and/or numberify-able data, validate
        } else if (Array.isArray(value)) {
            let invalidContent = false;
            for (let i = 0; i < value.length; i++) {
                let thisValue = value[i];
                // If it's a string, check if there's a number in the string
                if (typeof thisValue === 'string') {
                    thisValue = utils.number(thisValue);
                }
                // If even a single item is not a number or NaN, invalidate
                if (typeof thisValue !== 'number' || Number.isNaN(thisValue)) {
                    invalidContent = true;
                    break;
                }
            }
            if (invalidContent === false) {
                result = true;
            }
        }
        utils.defer(callback, result);
    }

    /**
     * Add filters to a query
     *
     * @param {Object} filter 			   		The data from the frontend
     * @param {String} filter.mode			  	The filter mode, either one of
     *                                     		"between", "gt" or "lt"
     * @param {String} [filter.presence='some'] The presence mode, either on of
     *                                          "none" and "some". Default: 'some'
     * @param {String|Object} filter.value 		The value that is filtered for
     */
    addFilterToQuery(filter) {
        const query = {};
        const presence = filter.presence || 'some';
        // Filter empty/non-empty arrays (copied from textarray)
        if (filter.value === undefined
            || filter.value === null
            || filter.value === '') {
            // "At least one element contains nothing"
            // This isn't 100% accurate because this will only return arrays that
            // don't have elements, not ones that have empty elements, but it works
            // fine for 99% of the usecase
            query[this.path] = presence === 'some' ? {
                $size: 0,
                // "No elements contain nothing"
            } : {
                    $not: {
                        $size: 0,
                    },
                };
            return query;
        }
        // Filter between two numbers
        if (filter.mode === 'between') {
            const min = utils.number(filter.value.min);
            const max = utils.number(filter.value.max);
            if (!isNaN(min) && !isNaN(max)) {
                query[this.path] = {
                    $gte: min,
                    $lte: max,
                };
                query[this.path] = addPresenceToQuery(presence, query[this.path]);
            }
            return query;
        }
        const value = utils.number(filter.value);
        // Filter greater than, less than and equals
        if (!isNaN(value)) {
            if (filter.mode === 'gt') {
                query[this.path] = {
                    $gt: value,
                };
            }
            else if (filter.mode === 'lt') {
                query[this.path] = {
                    $lt: value,
                };
            }
            else {
                query[this.path] = {
                    $eq: value,
                };
            }
            query[this.path] = addPresenceToQuery(presence, query[this.path]);
        }
        return query;
    }

    /**
     * Checks that a valid array of number has been provided in a data object
     * An empty value clears the stored value and is considered valid
     *
     * Deprecated
     */
    inputIsValid(data, required, item) {
        const value = this.getValueFromData(data);
        if (required) {
            if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
                return true;
            }
            if (value === undefined || !Array.isArray(value) || (typeof value !== 'string') || (typeof value !== 'number')) {
                return false;
            }
            if (Array.isArray(value) && !(<any>value).length) {
                return false;
            }
        }
        if (typeof value === 'string') {
            if (!isValidNumber(value)) {
                return false;
            }
        }
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
                if (!isValidNumber(value[index])) {
                    return false;
                }
            }
        }
        return (value === undefined || Array.isArray(value) || (typeof value === 'string') || (typeof value === 'number'));
    }

    /**
     * Updates the value for this field in the item from a data object
     */
    updateItem(item, data, callback) {
        let value = this.getValueFromData(data);
        if (value === undefined || value === null || value === '') {
            value = [];
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        value = value.map(function (num) {
            if (typeof num !== 'number') {
                num = utils.number(num);
            }
            return num;
        }).filter(function (num) {
            return !Number.isNaN(num);
        });
        item.set(this.path, value);
        process.nextTick(callback);
    }
}
