import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let TextArray = new Keystone.List('TextArray', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

TextArray.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.TextArray,
	},
	fieldB: {
		type: Types.TextArray,
	},
});

TextArray.defaultColumns = 'name, fieldA, fieldB';
TextArray.register();
