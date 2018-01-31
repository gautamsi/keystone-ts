let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let NumberArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NumberArrayFieldTestObject'));

export = function NumberArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new NumberArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberArrayFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
