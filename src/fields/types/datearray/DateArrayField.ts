import { DateInput } from '../../components/DateInput';
import { ArrayFieldBase, ArrayFieldPropsBase } from '../ArrayFieldBase';
import * as React from 'react';
import * as moment from 'moment';

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

export interface Props extends ArrayFieldPropsBase {
    formatString?: string;
    inputFormat?: string;
}
export class DateArrayField extends ArrayFieldBase<Props> {

    static displayName: string = 'DateArrayField';

    static type: string = 'DateArray';

    static defaultProps() {
        let props = ArrayFieldBase.defaultProps();
        return {
            formatString: DEFAULT_FORMAT_STRING,
            inputFormat: DEFAULT_INPUT_FORMAT,
            ...props
        };
    }

    processInputValue = (value) => {
        if (!value) return;
        const m = moment(value);
        return m.isValid() ? m.format(this.props.inputFormat) : value;
    }

    formatValue = (value) => {
        return value ? moment(value).format(this.props.formatString) : '';
    }

    getInputComponent = () => {
        return DateInput;
    }
}
