import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

// Model to demonstrate issue #2929

export let DateFieldMap = new Keystone.List('DateFieldMap', {
    map: { name: 'datefield' },
});

DateFieldMap.add({
    datefield: { type: Types.Date, initial: true },
});

DateFieldMap.register();
DateFieldMap.defaultColumns = 'datefield';
