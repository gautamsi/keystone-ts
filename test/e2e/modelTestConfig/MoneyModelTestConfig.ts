let objectAssign = require('object-assign');
let fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
let path = require('path');
let TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
let MoneyFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'MoneyFieldTestObject'));

export = function MoneyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'name'})),
		fieldA: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MoneyFieldTestObject(objectAssign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(objectAssign({}, config, {fieldName: 'fieldD'})),
	};
};
