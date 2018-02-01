import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Password = new Keystone.List('Password', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Password.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.Password,
        initial: true,
    },
    fieldB: {
        type: Types.Password,
    },
});

Password.defaultColumns = 'name, fieldA, fieldB';
Password.register();
