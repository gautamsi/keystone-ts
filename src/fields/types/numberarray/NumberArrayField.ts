import * as ArrayFieldMixin from '../../mixins/ArrayField';
import * as Field from '../Field';

export const NumberArrayField = Field.create({

    displayName: 'NumberArrayField',
    statics: {
        type: 'NumberArray',
    },

    mixins: [ArrayFieldMixin],

    cleanInput(input) {
        return input.replace(/[^\d]/g, '');
    },

});
