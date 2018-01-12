import { DateInput } from '../../components/DateInput';
import { FieldBase, FieldPropsBase } from '../FieldBase';
import * as moment from 'moment';
import * as React from 'react';
import {
    Button,
    FormInput,
    InlineGroup as Group,
    InlineGroupSection as Section,
} from 'elemental';

/*
TODO: Implement yearRange Prop, or deprecate for max / min values (better)
*/

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_FORMAT_STRING = 'Do MMM YYYY';

export interface Props extends FieldPropsBase {
    formatString?: string;
    inputFormat?: string;
    label?: string;
    note?: string;
    onChange?: any;
    path?: string;
    value?: string;
    isUTC?: boolean;
}

export class DateField extends FieldBase<Props> {
    static displayName: string = 'DateField';
    static type: string = 'Date';

    getDefaultProps() {
        return {
            formatString: DEFAULT_FORMAT_STRING,
            inputFormat: DEFAULT_INPUT_FORMAT,
        };
    }
    valueChanged({ value }) {
        this.props.onChange({
            path: this.props.path,
            value: value,
        });
    }
    toMoment(value) {
        if (this.props.isUTC) {
            return moment.utc(value);
        } else {
            return moment(value);
        }
    }
    isValid(value) {
        return this.toMoment(value).isValid();
    }
    format(value) {
        return value ? this.toMoment(value).format(this.props.formatString) : '';
    }
    setToday() {
        this.valueChanged({
            value: this.toMoment(new Date()).format(this.props.inputFormat),
        });
    }
    renderValue() {
        return (
            <FormInput noedit>
                {this.format(this.props.value)}
            </FormInput>
        );
    }
    renderField() {
        let dateAsMoment = this.toMoment(this.props.value);
        let value = this.props.value && dateAsMoment.isValid()
            ? dateAsMoment.format(this.props.inputFormat)
            : this.props.value;

        return (
            <Group>
                <Section grow>
                    <DateInput
                        format={this.props.inputFormat}
                        name={this.getInputName(this.props.path)}
                        onChange={this.valueChanged}
                        ref="dateInput"
                        value={value}
                    />
                </Section>
                <Section>
                    <Button onClick={this.setToday}>Today</Button>
                </Section>
            </Group>
        );
    }

}
