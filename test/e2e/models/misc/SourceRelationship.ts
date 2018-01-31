let keystone = require('../../../../index');
let Types = keystone.Field.Types;

let SourceRelationship = new keystone.List('SourceRelationship');

SourceRelationship.add({
	name: {
		type: String,
		initial: true,
	},
	fieldA: {
		type: Types.Relationship,
		ref: 'TargetRelationship'
	},
});

SourceRelationship.register();
SourceRelationship.defaultColumns = 'name, fieldA';

export = SourceRelationship;
