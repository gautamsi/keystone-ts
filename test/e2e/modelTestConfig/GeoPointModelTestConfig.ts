let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let GeoPointFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'GeoPointFieldTestObject'));

export = function GeoPointModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new GeoPointFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new GeoPointFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
