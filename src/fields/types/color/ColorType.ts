import { TextType } from '../text/TextType';

/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */
export class ColorType extends TextType {

    constructor(list, path, options) {
        super(list, path, options);
        this._nativeType = String;
    }
    static properName = 'Color';
}
