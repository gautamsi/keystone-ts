import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

let SourceRelationship = new Keystone.List('SourceRelationship', {});

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
