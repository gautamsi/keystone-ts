import * as React from 'react';
import { FormInput } from 'elemental';
import { FieldBase, FieldPropsBase } from '../FieldBase';

export class NumberField extends FieldBase<FieldPropsBase> {
    static displayName: string = 'NumberField';
    static type: string = 'Number';
    valueChanged(event) {
        let newValue = event.target.value;
        if (/^-?\d*\.?\d*$/.test(newValue)) {
            this.props.onChange({
                path: this.props.path,
                value: newValue,
            });
        }
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
