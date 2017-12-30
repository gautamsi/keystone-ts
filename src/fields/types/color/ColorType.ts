import * as  FieldType from '../Type';
import { text as TextType } from '../text/TextType';
import * as  util from 'util';


/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */
export function color(list, path, options) {
    this._nativeType = String;
    color.super_.call(this, list, path, options);
}
color['properName'] = 'Color';
util.inherits(color, FieldType);

color.prototype.validateInput = TextType.prototype.validateInput;
color.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
color.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
