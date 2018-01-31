import { Keystone, FieldTypes as Types, List } from '../../../../src/index';

export let CloudinaryImage = new Keystone.List('CloudinaryImage', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

CloudinaryImage.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.CloudinaryImage,
	},
	fieldB: {
		type: Types.CloudinaryImage,
	},
});

CloudinaryImage.defaultColumns = 'name, fieldA, fieldB';
CloudinaryImage.register();
