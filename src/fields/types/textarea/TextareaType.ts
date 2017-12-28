const FieldType = require('../Type');
const TextType = require('../text/TextType');
const util = require('util');
const utils = require('keystone-utils');


/**
 * Text FieldType Constructor
 * @extends Field
 * @api public
 */
function textarea (list, path, options) {
	this._nativeType = String;
	this._underscoreMethods = ['format', 'crop'];
	this.height = options.height || 90;
	this.multiline = true;
	this._properties = ['height', 'multiline'];
	textarea.super_.call(this, list, path, options);
}
textarea.properName = 'Textarea';
util.inherits(textarea, FieldType);


textarea.prototype.validateInput = TextType.prototype.validateInput;
textarea.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
textarea.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
textarea.prototype.crop = TextType.prototype.crop;

/**
 * Formats the field value
 * @api public
 */
textarea.prototype.format = function (item) {
	return utils.textToHTML(item.get(this.path));
};

/* Export Field Type */
export = textarea;
