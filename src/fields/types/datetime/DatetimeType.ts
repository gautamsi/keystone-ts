import * as moment from 'moment';
import { DateType } from '../date/DateType';
import * as utils from 'keystone-utils';

// ISO_8601 is needed for the automatically created createdAt and updatedAt fields
const parseFormats = ['YYYY-MM-DD', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD H:m', 'YYYY-MM-DD h:mm:s a Z', moment.ISO_8601];
/**
 * DateTime FieldType Constructor
 * @extends Field
 * @api public
 */
export class DateTimeType extends DateType {
    paths: { date: string; time: string; tzOffset: string; };


    constructor(list, path, options) {
        super(list, path, options);
        this._nativeType = Date;
        this._underscoreMethods = ['format', 'moment', 'parse'];
        this._fixedSize = 'full';
        this._properties = ['formatString', 'isUTC'];
        this.typeDescription = 'date and time';
        this.parseFormatString = options.parseFormat || parseFormats;
        this.formatString = (options.format === false) ? false : (options.format || 'YYYY-MM-DD h:mm:ss a');
        this.isUTC = options.utc || false;
        if (this.formatString && typeof this.formatString !== 'string') {
            throw new Error('FieldType.DateTime: options.format must be a string.');
        }
        this.paths = {
            date: this.path + '_date',
            time: this.path + '_time',
            tzOffset: this.path + '_tzOffset',
        };
    }
    static properName = 'DatetimeType';


    /**
     * Get the value from a data object; may be simple or a pair of fields
     */
    getInputFromData(data) {
        const dateValue = this.getValueFromData(data, '_date');
        const timeValue = this.getValueFromData(data, '_time');
        const tzOffsetValue = this.getValueFromData(data, '_tzOffset');
        if (dateValue && timeValue) {
            let combined = dateValue + ' ' + timeValue;
            if (typeof tzOffsetValue !== 'undefined') {
                combined += ' ' + tzOffsetValue;
            }
            return combined;
        }

        return this.getValueFromData(data);
    }


    validateRequiredInput(item, data, callback) {
        const value = this.getInputFromData(data);
        let result = !!value;
        if (value === undefined && item.get(this.path)) {
            result = true;
        }
        utils.defer(callback, result);
    }

    /**
     * Validates the input we get to be a valid date,
     * undefined, null or an empty string
     */
    validateInput(data, callback) {
        const value = this.getInputFromData(data);
        // If the value is null, undefined or an empty string
        // bail early since updateItem sanitizes that just fine
        let result = true;
        if (value) {
            result = this.parse(value, this.parseFormatString, true).isValid();
        }
        utils.defer(callback, result);
    }

    /**
     * Checks that a valid date has been provided in a data object
     * An empty value clears the stored value and is considered valid
     *
     * Deprecated
     */
    inputIsValid(data, required, item) {
        if (!(this.path in data && !(this.paths.date in data && this.paths.time in data)) && item && item.get(this.path)) return true;
        const newValue = moment(this.getInputFromData(data), parseFormats);
        if (required && (!newValue || !newValue.isValid())) {
            return false;
        } else if (this.getInputFromData(data) && newValue && !newValue.isValid()) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Updates the value for this field in the item from a data object
     */
    updateItem(item, data, callback) {
        // Get the values from the data
        const value = this.getInputFromData(data);
        if (value !== undefined) {
            if (value !== null && value !== '') {
                // If the value is not null, empty string or undefined, parse it
                const newValue = this.parse(value, this.parseFormatString, true);
                // If it's valid and not the same as the last value, save it
                if (!item.get(this.path) || !newValue.isSame(item.get(this.path))) {
                    item.set(this.path, newValue.toDate());
                }
                // If it's null or empty string, clear it out
            } else {
                item.set(this.path, null);
            }
        }
        process.nextTick(callback);
    }
}
