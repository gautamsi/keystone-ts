import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Money = new Keystone.List('Money', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Money.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Money,
		initial: true,
	},
	fieldB: {
		type: Types.Money,
	},
});

Money.defaultColumns = 'name, fieldA, fieldB';
Money.register();
