import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let ManyRelationship = new Keystone.List('ManyRelationship', {});

ManyRelationship.add({
    name: { type: String, initial: true, index: true },
    fieldA: { type: Types.Relationship, ref: 'Text', initial: true, many: true },
});

ManyRelationship.register();
