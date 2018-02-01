import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let CloudinaryImageMultiple = new Keystone.List('CloudinaryImageMultiple', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

CloudinaryImageMultiple.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.CloudinaryImages,
    },
    fieldB: {
        type: Types.CloudinaryImages,
    },
});

CloudinaryImageMultiple.defaultColumns = 'name, fieldA, fieldB';
CloudinaryImageMultiple.register();
