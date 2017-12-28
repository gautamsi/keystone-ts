const assign = require('object-assign');
const FieldType = require('../Type');
const TextType = require('../text/TextType');
const util = require('util');


/**
 * Code FieldType Constructor
 * @extends Field
 * @api public
 */
function code (list, path, options) {
	this._nativeType = String;
	this._defaultSize = 'full';
	this.height = options.height || 180;
	this.lang = options.lang || options.language;
	this._properties = ['editor', 'height', 'lang'];
	this.codemirror = options.codemirror || {};
	this.editor = assign({ mode: this.lang }, this.codemirror);
	code.super_.call(this, list, path, options);
}
code.properName = 'Code';
util.inherits(code, FieldType);


code.prototype.validateInput = TextType.prototype.validateInput;
code.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Inherit from TextType prototype */
code.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
export = code;
