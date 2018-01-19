import { FieldTypeBase } from '../FieldTypeBase';
import * as moment from 'moment';
import * as util from 'util';
import * as utils from 'keystone-utils';
import { TextType } from '../text/TextType';

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */
export class DateType extends FieldTypeBase {
    timezoneUtcOffsetMinutes: number;
    isUTC: boolean;
    yearRange: number;
    formatString: string;
    parseFormatString: string;

    constructor(list, path, options) {
        super(list, path, options);
    }
    protected init() {
        super.init();
        this._nativeType = Date;
        this._underscoreMethods = ['format', 'moment', 'parse'];
        this._fixedSize = 'medium';
        this._properties = ['formatString', 'yearRange', 'isUTC', 'inputFormat'];
        this.parseFormatString = this.options.inputFormat || 'YYYY-MM-DD';
        this.formatString = (this.options.format === false) ? false : (this.options.format || 'Do MMM YYYY');

        this.yearRange = this.options.yearRange;
        this.isUTC = this.options.utc || false;

        /*
         * This offset is used to determine whether or not a stored date is probably corrupted or not.
         * If the date/time stored plus this offset equals a time close to midnight for that day, that
         * resulting date/time will be provided via the getData method instead of the one that is stored.
         * By default this timezone offset matches the offset of the keystone server. Using the default
         * setting is highly recommended.
         */
        this.timezoneUtcOffsetMinutes = this.options.timezoneUtcOffsetMinutes || moment().utcOffset();

        if (this.formatString && typeof this.formatString !== 'string') {
            throw new Error('FieldType.Date: options.format must be a string.');
        }
    }
    static properName = 'Date';

    /**
     * validates required inputs
     * @param item copied from TextType.validateRequiedInput
     * @param data
     * @param callback
     */
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
        if (filter.mode === 'between') {
            if (filter.after && filter.before) {
                filter.after = moment(filter.after);
                filter.before = moment(filter.before);
                if (filter.after.isValid() && filter.before.isValid()) {
                    query[this.path] = {
                        $gte: filter.after.startOf('day').toDate(),
                        $lte: filter.before.endOf('day').toDate(),
                    };
                }
            }
        } else if (filter.value) {
            const day = {
                moment: moment(filter.value),
                start: undefined,
                end: undefined
            };
            day.start = day.moment.startOf('day').toDate();
            day.end = moment(filter.value).endOf('day').toDate();
            if (day.moment.isValid()) {
                if (filter.mode === 'after') {
                    query[this.path] = { $gt: day.end };
                } else if (filter.mode === 'before') {
                    query[this.path] = { $lt: day.start };
                } else {
                    query[this.path] = { $gte: day.start, $lte: day.end };
                }
            }
        }
        if (filter.inverted) {
            query[this.path] = { $not: query[this.path] };
        }
        return query;
    }

    /**
     * Formats the field value
     * ignore 3rd parameter onward, needed for DateArrayType to work properly.
     */
    format(item, format) {
        if (format || this.formatString) {
            return item.get(this.path) ? this.moment(item).format(format || this.formatString) : '';
        } else {
            return item.get(this.path) || '';
        }
    }

    /**
     * Returns a new `moment` object with the field value
     */
    moment(item) {
        const m = moment(item.get(this.path));
        if (this.isUTC) m.utc();
        return m;
    }

    /**
     * Parses input with the correct moment version (normal or utc) and uses
     * either the provided input format or the default for the field
     */
    parse(value, format?, strict?) {
        const m = this.isUTC ? moment.utc : moment;
        // TODO Check should maybe be if (typeof value === 'string')
        // use the parseFormatString. Ever relevant?
        if (typeof value === 'number' || value instanceof Date) {
            return m(value);
        } else {
            return m(value, format || this.parseFormatString, strict);
        }
    }

    /**
     * Asynchronously confirms that the provided date is valid
     */
    validateInput(data, callback) {
        const value = this.getValueFromData(data);
        let result = true;
        if (value) {
            result = this.parse(value).isValid();
        }
        utils.defer(callback, result);
    }

    /**
     *
     * Retrives the date as a 'Javascript Date'.
     *
     * Note: If the JS date retrieved is UTC and has a time other than midnight,
     * it has likely become corrupted. In this instance, the below code will
     * attempt to add the server offset to it to fix the date.
     */
    getData(item) {
        const value = item.get(this.path);
        const momentDate = this.isUTC ? moment.utc(value) : moment(value);

        if (this.isUTC) {
            if (momentDate.format('HH:mm:ss:SSS') !== '00:00:00:000') {
                // Time is NOT midnight. So, let's try and add the server timezone offset
                // to convert it (back?) to the original intended time. Since we don't know
                // if the time was recorded during daylight savings time or not, allow +/-
                // 1 hour leeway.

                const adjustedMomentDate = moment.utc(momentDate);

                // Add the server the time so that it is within +/- 1 hour of midnight.
                adjustedMomentDate.add(this.timezoneUtcOffsetMinutes, 'minutes');

                // Add 1 hour to the time so then we know any valid date/time would be between
                // 00:00 and 02:00 on the correct day
                adjustedMomentDate.add(1, 'hours'); // So
                const timeAsNumber = Number(adjustedMomentDate.format('HHmmssSSS'));
                if (timeAsNumber >= 0 && timeAsNumber <= 20000000) {
                    // Time is close enough to midnight so extract the date with a zeroed (ie. midnight) time value
                    return adjustedMomentDate.startOf('day').toDate();
                } else {
                    // Seems that that adding the server time offset didn't produce a time
                    // that is close enough to midnight. Therefore, let's use the date/time
                    // as-is
                    return momentDate.toDate();
                }
            }
        }

        return momentDate.toDate();
    }

    /**
     * Checks that a valid date has been provided in a data object
     * An empty value clears the stored value and is considered valid
     *
     * Deprecated
     */
    inputIsValid(data, required, item) {
        if (!(this.path in data) && item && item.get(this.path)) return true;
        const newValue = moment(data[this.path], this.parseFormatString);
        if (required && (!newValue.isValid())) {
            return false;
        } else if (data[this.path] && newValue && !newValue.isValid()) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Updates the value for this field in the item from a data object
     */
    updateItem(item, data, callback) {
        const value = this.getValueFromData(data);
        if (value !== null && value !== '') {
            // If the value is not null, empty string or undefined, parse it
            const newValue = this.parse(value);
            // If it's valid and not the same as the last value, save it
            if (newValue.isValid() && (!item.get(this.path) || !newValue.isSame(item.get(this.path)))) {
                item.set(this.path, newValue.toDate());
            }
        } else {
            // If it's null or empty string, clear it out
            item.set(this.path, null);
        }
        process.nextTick(callback);
    }
}
