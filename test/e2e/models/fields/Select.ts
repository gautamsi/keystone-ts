import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Select = new Keystone.List('Select', {
    autokey: {
        path: 'key',
        from: 'name',
        unique: true,
    },
    track: true,
});

Select.add({
    name: {
        type: String,
        initial: true,
        index: true,
    },
    fieldA: {
        type: Types.Select,
        options: 'one, two, three',
        initial: true,
        required: true,
        index: true,
    },
    fieldB: {
        type: Types.Select,
        numeric: true,
        options: [
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
        ]
    },
});

Select.defaultColumns = 'name, fieldA, fieldB';
Select.register();
