import * as Field from '../Field';
import * as React from 'react';
import { FormInput } from 'elemental';

/*
	TODO:
	- gravatar
	- validate email address
 */

export const EmailField = Field.create({
    displayName: 'EmailField',
    propTypes: {
        path: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
    },
    statics: {
        type: 'Email',
    },
    renderField() {
        return (
            <FormInput
                name={this.getInputName(this.props.path)}
                ref="focusTarget"
                value={this.props.value}
                onChange={this.valueChanged}
                autoComplete="off"
                type="email"
            />
        );
    },
    renderValue() {
        return this.props.value ? (
            <FormInput noedit component="a" href={'mailto:' + this.props.value}>
                {this.props.value}
            </FormInput>
        ) : (
                <FormInput noedit />
            );
    },
});
