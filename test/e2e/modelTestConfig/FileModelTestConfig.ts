let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let FileFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'FileFieldTestObject'));

export = function FileModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new FileFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new FileFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
