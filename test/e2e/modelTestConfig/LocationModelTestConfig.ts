let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let LocationFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'LocationFieldTestObject'));

export = function LocationModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new LocationFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new LocationFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
