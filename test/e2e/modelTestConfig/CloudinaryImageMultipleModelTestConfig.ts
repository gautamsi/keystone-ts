let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let CloudinaryImageMultipleFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CloudinaryImageMultipleFieldTestObject'));
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

export = function CloudinaryImageMultipleModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageMultipleFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageMultipleFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
