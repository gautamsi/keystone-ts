import { FormInput } from 'elemental';
import * as Field from '../Field';
import * as React from 'react';

export const MoneyField = Field.create({
    displayName: 'MoneyField',
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        path: React.PropTypes.string.isRequired,
        value: React.PropTypes.number,
    },
    statics: {
        type: 'Money',
    },

    valueChanged(event) {
        let newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
        if (newValue === this.props.value) return;

        this.props.onChange({
            path: this.props.path,
            value: newValue,
        });
    },
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
    },

});
