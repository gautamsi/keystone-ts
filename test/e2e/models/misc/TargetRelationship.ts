let keystone = require('../../../../index');
let Types = keystone.Field.Types;

let TargetRelationship = new keystone.List('TargetRelationship');

TargetRelationship.add({
	name: {
		type: String,
		initial: true,
	},
});

TargetRelationship.relationship({
	ref: 'SourceRelationship',
	refPath: 'fieldA',
	path: 'sourceFieldA'
});

TargetRelationship.register();
TargetRelationship.defaultColumns = 'name';

export = TargetRelationship;
