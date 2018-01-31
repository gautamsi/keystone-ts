let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let ColorFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'ColorFieldTestObject'));

export = function ColorModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new ColorFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new ColorFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
