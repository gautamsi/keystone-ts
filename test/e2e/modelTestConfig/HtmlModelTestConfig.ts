let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let HtmlFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'HtmlFieldTestObject'));

export = function HtmlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new HtmlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new HtmlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
