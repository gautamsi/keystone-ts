import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Text = new Keystone.List('Text', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Text.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.Text,
        initial: true,
    },
    fieldB: {
        type: Types.Text,
    },
});

Text.defaultColumns = 'name, fieldA, fieldB';
Text.register();
