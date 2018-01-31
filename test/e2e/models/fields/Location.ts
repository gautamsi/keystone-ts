import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Location = new Keystone.List('Location', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Location.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.Location,
        initial: true,
    },
    fieldB: {
        type: Types.Location,
    },
});

Location.defaultColumns = 'name, fieldA, fieldB';
Location.register();
