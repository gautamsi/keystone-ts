import * as React from 'react';
import { FormInput } from 'elemental';
import { FieldPropsBase, FieldBase } from '../Field';

interface Props extends FieldPropsBase {
    path: string;
    value?: string;
}
/*
	TODO:
	- gravatar
	- validate email address
 */
export class EmailField extends FieldBase<Props> {

    static displayName: string = 'EmailField';

    static type: string = 'Email';
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
    }
    renderValue() {
        return this.props.value ? (
            <FormInput noedit component="a" href={'mailto:' + this.props.value}>
                {this.props.value}
            </FormInput>
        ) : (
                <FormInput noedit />
            );
    }
}
