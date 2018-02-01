import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Num = new Keystone.List('Number', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true
});

Num.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Number,
		initial: true,
		index: true,
	},
	fieldB: {
		type: Number,
		index: true
	}
});

Num.defaultColumns = 'name, fieldA, fieldB';
Num.register();
