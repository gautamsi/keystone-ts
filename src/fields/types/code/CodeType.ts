import * as  assign from 'object-assign';
import { FieldTypeBase } from '../FieldTypeBase';
import { TextType } from '../text/TextType';

/**
 * Code FieldType Constructor
 * @extends Field
 * @api public
 */
export class CodeType extends TextType {
    editor: any;
    codemirror: any;
    lang: string;
    height: number;


    constructor(list, path, options) {
        super(list, path, options);
        this._nativeType = String;
        this._defaultSize = 'full';
        this.height = options.height || 180;
        this.lang = options.lang || options.language;
        this._properties = ['editor', 'height', 'lang'];
        this.codemirror = options.codemirror || {};
        this.editor = assign({ mode: this.lang }, this.codemirror);
    }
    static properName = 'Code';
}
