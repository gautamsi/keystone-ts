import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Color = new Keystone.List('Color', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Color.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Color,
		initial: true,
	},
	fieldB: {
		type: Types.Color,
	},
});

Color.defaultColumns = 'name, fieldA, fieldB';
Color.register();
