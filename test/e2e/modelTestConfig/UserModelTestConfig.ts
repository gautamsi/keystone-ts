let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let NameFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject'));
let EmailFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject'));
let PasswordFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject'));
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let BooleanFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject'));

export = function UserModelTestConfig (config) {
	return {
		name: new NameFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		email: new EmailFieldTestObject(objectAssign({}, config, {fieldName: 'email'})),
		password: new PasswordFieldTestObject(objectAssign({}, config, {fieldName: 'password'})),
		resetPasswordKey: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'resetPasswordKey'})),
		isAdmin: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'isAdmin'})),
		isMember: new BooleanFieldTestObject(objectAssign({}, config, {fieldName: 'isMember'})),
	};
};
