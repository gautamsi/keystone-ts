import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Email = new Keystone.List('Email', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Email.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.Email,
        initial: true,
        index: true,
    },
    fieldB: {
        type: Types.Email,
        index: true,
    },
});

Email.defaultColumns = 'name, fieldA, fieldB';
Email.register();
