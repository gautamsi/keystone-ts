import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

let TargetRelationship = new Keystone.List('TargetRelationship', {});

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
