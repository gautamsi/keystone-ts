import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let HiddenRelationship = new Keystone.List('HiddenRelationship', {});

HiddenRelationship.add({
    fieldA: { type: Types.Relationship, ref: 'User', initial: true, hidden: true },
});

HiddenRelationship.register();
