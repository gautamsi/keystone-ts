let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let MarkdownFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'MarkdownFieldTestObject'));

export = function MarkdownModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MarkdownFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
