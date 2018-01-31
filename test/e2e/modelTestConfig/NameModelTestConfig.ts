let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let NameFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject'));
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

export = function NameModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NameFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NameFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
