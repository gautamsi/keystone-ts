const FieldType = require('../Type');
const TextType = require('../text/TextType');
const util = require('util');


/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */
function color (list, path, options) {
	this._nativeType = String;
	color.super_.call(this, list, path, options);
}
color.properName = 'Color';
util.inherits(color, FieldType);

color.prototype.validateInput = TextType.prototype.validateInput;
color.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
color.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
export default color;
