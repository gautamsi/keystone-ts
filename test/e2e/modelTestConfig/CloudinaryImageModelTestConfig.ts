let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let CloudinaryImageFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CloudinaryImageFieldTestObject'));
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

export = function CloudinaryImageModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
