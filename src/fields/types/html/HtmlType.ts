import { Field as FieldType } from '../Type';
import { text as TextType } from '../text/TextType';
import * as util from 'util';


/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
export function html(list, path, options) {
    this._nativeType = String;
    this._defaultSize = 'full';
    this.wysiwyg = options.wysiwyg || false;
    this.height = options.height || 180;
    this._properties = ['wysiwyg', 'height'];
    html.super_.call(this, list, path, options);
}
html['properName'] = 'Html';
util.inherits(html, FieldType);


html.prototype.validateInput = TextType.prototype.validateInput;
html.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
html.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
