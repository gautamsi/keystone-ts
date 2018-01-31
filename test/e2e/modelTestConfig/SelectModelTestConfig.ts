let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let SelectFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'SelectFieldTestObject'));
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

export = function SelectModelTestConfig(config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new SelectFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new SelectFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
