import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Html = new Keystone.List('Html', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Html.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.Html,
        initial: true,
    },
    fieldB: {
        type: Types.Html,
    },
});

Html.defaultColumns = 'name, fieldA, fieldB';
Html.register();
