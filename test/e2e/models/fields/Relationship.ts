import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Relationship = new Keystone.List('Relationship', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Relationship.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.Relationship,
        ref: 'User',
        inline: true,
        initial: true,
    },
    fieldB: {
        type: Types.Relationship,
        ref: 'User',
    },
});

Relationship.defaultColumns = 'name, fieldA, fieldB';
Relationship.register();
