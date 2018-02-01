let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let EmailFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject'));

export = function EmailModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
