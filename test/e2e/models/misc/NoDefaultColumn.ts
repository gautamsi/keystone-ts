import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let NoDefaultColumn = new Keystone.List('NoDefaultColumn', {
    track: true,
});

NoDefaultColumn.add({
    fieldA: {
        type: Types.Text,
        initial: true,
    },
    fieldB: {
        type: Types.Text,
    },
});

NoDefaultColumn.register();
