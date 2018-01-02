import { FieldTypeBase } from '../FieldTypeBase';
import { TextType } from '../text/TextType';
import * as util from 'util';


/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
export class HtmlType extends TextType {
    height: number;
    wysiwyg: boolean;

    constructor(list, path, options) {
        super(list, path, options);
        this._nativeType = String;
        this._defaultSize = 'full';
        this.wysiwyg = options.wysiwyg || false;
        this.height = options.height || 180;
        this._properties = ['wysiwyg', 'height'];
    }
    static properName = 'Html';
}
