import * as  assign from 'object-assign';
import * as  FieldType from '../Type';
import { text as TextType } from '../text/TextType';
import * as  util from 'util';


/**
 * Code FieldType Constructor
 * @extends Field
 * @api public
 */
export function code(list, path, options) {
    this._nativeType = String;
    this._defaultSize = 'full';
    this.height = options.height || 180;
    this.lang = options.lang || options.language;
    this._properties = ['editor', 'height', 'lang'];
    this.codemirror = options.codemirror || {};
    this.editor = assign({ mode: this.lang }, this.codemirror);
    code.super_.call(this, list, path, options);
}
code['properName'] = 'Code';
util.inherits(code, FieldType);


code.prototype.validateInput = TextType.prototype.validateInput;
code.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
code.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
