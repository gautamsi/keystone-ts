import { FieldTypeBase } from '../FieldTypeBase';
import * as moment from 'moment';
import * as util from 'util';
import * as utils from 'keystone-utils';
import { addPresenceToQuery } from '../../utils/addPresenceToQuery';
import { DateType } from '../date/DateType';

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */
export class DateArrayType extends FieldTypeBase {
    formatString: string;
    parseFormatString: string;
    separator: string;

    constructor(list, path, options) {
        super(list, path, options);
    }
    protected init() {
        super.init();
        this._nativeType = [Date];
        this._defaultSize = 'medium';
        this._underscoreMethods = ['format'];
        this._properties = ['formatString'];
        this.parseFormatString = this.options.parseFormat || 'YYYY-MM-DD';
        this.formatString = (this.options.format === false) ? false : (this.options.format || 'Do MMM YYYY');
        if (this.formatString && typeof this.formatString !== 'string') {
            throw new Error('FieldType.DateArray: options.format must be a string.');
        }
        this.separator = this.options.separator || ' | ';
    }
    static properName = 'DateArray';

    /**
     * Formats the field value
     */
    format(item, format, separator) {
        let value = item.get(this.path);
        if (format || this.formatString) {
            value = value.map(function (d) {
                return moment(d).format(format || this._formatString);
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
        if (value !== undefined && value !== null && value !== '') {
            if (!Array.isArray(value)) {
                value = [value];
            }
            for (let i = 0; i < value.length; i++) {
                let currentValue;
                // If we pass it an epoch, parse it without the format string
                if (typeof value[i] === 'number') {
                    currentValue = moment(value[i]);
                } else {
                    currentValue = moment(value[i], this.parseFormatString);
                }
                // If moment does not think it's a valid date, invalidate
                if (!currentValue.isValid()) {
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
        if (typeof value === 'string' || typeof value === 'number') {
            if (moment(value).isValid()) {
                result = true;
            }
            // If it's an array of only dates and/or dateify-able data, validate
        } else if (Array.isArray(value)) {
            let invalidContent = false;
            for (let i = 0; i < value.length; i++) {
                let currentValue;
                // If we pass it an epoch, parse it without the format string
                if (typeof value[i] === 'number') {
                    currentValue = moment(value[i]);
                } else {
                    currentValue = moment(value[i], this.parseFormatString);
                }
                // If even a single item is not a valid date, invalidate
                if (!currentValue.isValid()) {
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
     * @param {String} filter.mode  	   		The filter mode, either one of "on",
     *                                     		"after", "before" or "between"
     * @param {String} [filter.presence='some'] The presence mode, either on of
     *                                          "none" and "some". Default: 'some'
     * @param {String|Object} filter.value 		The value that is filtered for
     */
    addFilterToQuery(filter) {
        const dateTypeAddFilterToQuery = DateType.prototype.addFilterToQuery.bind(this);
        const query = dateTypeAddFilterToQuery(filter);
        if (query[this.path]) {
            query[this.path] = addPresenceToQuery(filter.presence || 'some', query[this.path]);
        }
        return query;
    }

    /**
     * Checks that a valid array of dates has been provided in a data object
     * An empty value clears the stored value and is considered valid
     *
     * Deprecated
     */
    inputIsValid(data, required, item) {

        let value = this.getValueFromData(data);
        const parseFormatString = this.parseFormatString;

        if (typeof value === 'string') {
            if (!moment(value, parseFormatString).isValid()) {
                return false;
            }
            value = [value];
        }

        if (required) {
            if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
                return true;
            }
            if (value === undefined || !Array.isArray(value)) {
                return false;
            }
            if (Array.isArray(value) && !value.length) {
                return false;
            }
        }

        if (Array.isArray(value)) {
            // filter out empty fields
            value = value.filter(function (date) {
                return date.trim() !== '';
            });
            // if there are no values left, and requried is true, return false
            if (required && !value.length) {
                return false;
            }
            // if any date in the array is invalid, return false
            if (value.some(function (dateValue) { return !moment(dateValue, parseFormatString).isValid(); })) {
                return false;
            }
        }

        return (value === undefined || Array.isArray(value));

    }


    /**
     * Updates the value for this field in the item from a data object
     */
    updateItem(item, data, callback) {

        let value = this.getValueFromData(data);

        if (Array.isArray(value)) {
            // Only save valid dates
            value = value.filter(function (date) {
                return moment(date).isValid();
            });
        }
        if (value === null || value === undefined) {
            value = [];
        }
        if (typeof value === 'string') {
            if (moment(value).isValid()) {
                value = [value];
            }
        }
        if (Array.isArray(value)) {
            item.set(this.path, value);
        }

        process.nextTick(callback);
    }
}
