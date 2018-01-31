import { Keystone, FieldTypes as Types, List } from '../../../src/index';

export let OtherList = new Keystone.List('OtherList', {
    autokey: { path: 'key', from: 'name', unique: true },
    track: true
});

OtherList.add({
    name: {
        type: Types.Name,
        required: true,
        index: true
    },
});

OtherList.defaultColumns = 'name';
OtherList.register();
