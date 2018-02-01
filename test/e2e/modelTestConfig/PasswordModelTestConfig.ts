let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let PasswordFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject'));

export = function PasswordModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
