import { FormInput } from 'elemental';
import * as React from 'react';
import { FieldBase, FieldPropsBase } from '../FieldBase';

interface Props extends FieldPropsBase {
    onChange: any;
    path: string;
    value?: number;
}

export class MoneyField extends FieldBase<Props> {
    static displayName: string = 'MoneyField';
    static type: string = 'Money';

    valueChanged(event) {
        let newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
        if (newValue === this.props.value) return;

        this.props.onChange({
            path: this.props.path,
            value: newValue,
        });
    }
    renderField() {
        return (
            <FormInput
                autoComplete="off"
                name={this.getInputName(this.props.path)}
                onChange={this.valueChanged}
                ref="focusTarget"
                value={this.props.value}
            />
        );
    }
}
