import { FieldTypeBase } from '../FieldTypeBase';
import { NumberType } from '../number/NumberType';
import * as numeral from 'numeral';

/**
 * Money FieldType Constructor
 * @extends Field
 * @api public
 */
export class MoneyType extends NumberType {
    _formatString: string;
    currency: string;

    constructor(list, path, options) {
        super(list, path, options);
        if (options.currency) {
            throw new Error('The currency option from money has been deprecated. Provide a formatString instead');
        }
    }
    protected init() {
        super.init();
        this.currency = this.options.currency;
        this._nativeType = Number;
        this._underscoreMethods = ['format'];
        this._properties = ['currency'];
        this._fixedSize = 'small';
        this._formatString = (this.options.format === false) ? false : (this.options.format || '$0,0.00');
        if (this._formatString && typeof this._formatString !== 'string') {
            throw new Error('FieldType.Money: options.format must be a string.');
        }
    }
    static properName = 'Money';

    /**
     * Formats the field value
     */
    format(item, format) {
        if (format || this._formatString) {
            return (typeof item.get(this.path) === 'number') ? numeral(item.get(this.path)).format(format || this._formatString) : '';
        } else {
            return item.get(this.path) || '';
        }
    }
}
