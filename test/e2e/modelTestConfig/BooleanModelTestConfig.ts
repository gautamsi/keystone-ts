let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let BooleanFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject'));

export = function BooleanModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
