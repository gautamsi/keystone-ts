let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let DatetimeFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DatetimeFieldTestObject'));

export = function DatetimeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new DatetimeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DatetimeFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
