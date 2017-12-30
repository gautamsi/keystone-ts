import * as ArrayFieldMixin from '../../mixins/ArrayField';
import * as Field from '../Field';

export const TextArrayField = Field.create({
    displayName: 'TextArrayField',
    statics: {
        type: 'TextArray',
    },
    mixins: [ArrayFieldMixin],
});
