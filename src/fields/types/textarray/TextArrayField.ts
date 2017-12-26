import ArrayFieldMixin from '../../mixins/ArrayField';
import Field from '../Field';

export = Field.create({
	displayName: 'TextArrayField',
	statics: {
		type: 'TextArray',
	},
	mixins: [ArrayFieldMixin],
});
