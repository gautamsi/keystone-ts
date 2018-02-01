let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let RelationshipFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'RelationshipFieldTestObject'));

export = function RelationshipModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new RelationshipFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new RelationshipFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
	};
};
