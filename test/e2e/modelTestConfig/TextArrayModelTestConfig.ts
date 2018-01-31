let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let TextArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextArrayFieldTestObject'));

export = function TextArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
