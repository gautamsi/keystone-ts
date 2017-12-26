import ArrayFieldMixin from '../../mixins/ArrayField';
import Field from '../Field';

export = Field.create({

	displayName: 'NumberArrayField',
	statics: {
		type: 'NumberArray',
	},

	mixins: [ArrayFieldMixin],

	cleanInput (input) {
		return input.replace(/[^\d]/g, '');
	},

});
