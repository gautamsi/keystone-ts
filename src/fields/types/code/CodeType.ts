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
    }
    protected init() {
        super.init();
        this._nativeType = String;
        this._defaultSize = 'full';
        this.height = this.options.height || 180;
        this.lang = this.options.lang || this.options.language;
        this._properties = ['editor', 'height', 'lang'];
        this.codemirror = this.options.codemirror || {};
        this.editor = assign({ mode: this.lang }, this.codemirror);
    }
    static properName = 'Code';
}
