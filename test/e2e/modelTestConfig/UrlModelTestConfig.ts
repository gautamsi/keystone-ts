let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let UrlFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'UrlFieldTestObject'));

export = function UrlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new UrlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new UrlFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
