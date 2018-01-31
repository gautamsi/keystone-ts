let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let NumberFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NumberFieldTestObject'));

export = function NumberModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
