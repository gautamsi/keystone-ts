import { TextType as TextType } from '../text/TextType';
import * as utils from 'keystone-utils';

/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
export class TextareaType extends TextType {
    multiline: boolean;
    height: number;

    get _underscoreMethods() {
        return ['format', 'crop'];
    }

    constructor(list, path, options) {
        super(list, path, options);
        // this._underscoreMethods = ['format', 'crop'];
        this.height = options.height || 90;
        this.multiline = true;
        this._properties = ['height', 'multiline'];
    }
    static properName = 'Textarea';

    /**
     * Formats the field value
     * @api public
     */
    format(item) {
        return utils.textToHTML(item.get(this.path));
    }
}
