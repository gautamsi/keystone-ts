let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let CodeFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CodeFieldTestObject'));
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

export = function CodeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CodeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CodeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
