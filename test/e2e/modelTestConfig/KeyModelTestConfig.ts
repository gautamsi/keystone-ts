let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let KeyFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'KeyFieldTestObject'));

export = function KeyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new KeyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new KeyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
