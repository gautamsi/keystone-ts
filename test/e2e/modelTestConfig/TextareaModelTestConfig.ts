let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let TextareaFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextareaFieldTestObject'));

export = function TextareaModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextareaFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextareaFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
