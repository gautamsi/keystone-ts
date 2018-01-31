import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Code = new Keystone.List('Code', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Code.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Code,
		initial: true,
		height: 200,
	},
	fieldB: {
		type: Types.Code,
		height: 200,
	},
});

Code.defaultColumns = 'name, fieldA, fieldB';
Code.register();
