import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Datetime = new Keystone.List('Datetime', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Datetime.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Datetime,
		initial: true,
	},
	fieldB: {
		type: Types.Datetime,
	},
});

Datetime.defaultColumns = 'name, fieldA, fieldB';
Datetime.register();
