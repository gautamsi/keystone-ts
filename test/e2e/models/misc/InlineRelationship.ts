import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let InlineRelationship = new Keystone.List('InlineRelationship', {});

InlineRelationship.add({
    fieldA: { type: Types.Relationship, ref: 'User', createInline: true },
});

InlineRelationship.register();
