import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let DateArray = new Keystone.List('DateArray', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

DateArray.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.DateArray,
	},
	fieldB: {
		type: Types.DateArray,
	},
});

DateArray.defaultColumns = 'name, fieldA, fieldB';
DateArray.register();
