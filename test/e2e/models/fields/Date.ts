import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Date = new Keystone.List('Date', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Date.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.Date,
        initial: true,
    },
    fieldB: {
        type: Types.Date,
    },
});

Date.defaultColumns = 'name, fieldA, fieldB';
Date.register();
