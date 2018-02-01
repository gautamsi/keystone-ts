let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let DateFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateFieldTestObject'));

export = function DateModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DateFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
