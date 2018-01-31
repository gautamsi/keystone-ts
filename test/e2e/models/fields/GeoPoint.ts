import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let GeoPoint = new Keystone.List('GeoPoint', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

GeoPoint.add({
    name: {
        type: String,
        initial: true,
        required: true,
        index: true,
    },
    fieldA: {
        type: Types.GeoPoint,
        initial: true,
    },
    fieldB: {
        type: Types.GeoPoint,
    },
});

GeoPoint.defaultColumns = 'name, fieldA, fieldB';
GeoPoint.register();
