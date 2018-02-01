let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let DateArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateArrayFieldTestObject'));

export = function DateArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
