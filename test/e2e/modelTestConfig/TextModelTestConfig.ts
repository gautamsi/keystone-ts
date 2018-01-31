let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

export = function TextModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
