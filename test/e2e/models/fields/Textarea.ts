import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let Textarea = new Keystone.List('Textarea', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Textarea.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Textarea,
		initial: true,
	},
	fieldB: {
		type: Types.Textarea,
	},
});

Textarea.defaultColumns = 'name, fieldA, fieldB';
Textarea.register();
