import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let NumberArray = new Keystone.List('NumberArray', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

NumberArray.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.NumberArray,
	},
	fieldB: {
		type: Types.NumberArray,
	},
});

NumberArray.defaultColumns = 'name, fieldA, fieldB';
NumberArray.register();
