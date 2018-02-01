import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Url = new Keystone.List('Url', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Url.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Url,
		initial: true,
	},
	fieldB: {
		type: Types.Url,
	},
});

Url.defaultColumns = 'name, fieldA, fieldB';
Url.register();
