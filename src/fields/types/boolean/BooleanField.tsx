import * as React from 'react';
import { FieldBase, FieldPropsBase } from '../FieldBase';
import { Checkbox } from '../../components/Checkbox';
import { FormField } from 'elemental';

const NOOP = () => { };

export interface Props extends FieldPropsBase {
    indent?: boolean;
    label?: string;
    onChange: any;
    path: string;
    value?: boolean;
}

export class BooleanField extends FieldBase<Props> {
    static displayName: string = 'BooleanField';
    static type: string = 'Boolean';

    valueChanged(value) {
        this.props.onChange({
            path: this.props.path,
            value: value,
        });
    }
    renderFormInput() {
        if (!this.shouldRenderField()) return;

        return (
            <input
                name={this.getInputName(this.props.path)}
                type="hidden"
                value={`${!!this.props.value}`}
            />
        );
    }
    renderUI() {
        const { indent, value, label, path } = this.props;

        return (
            <div data-field-name={path} data-field-type="boolean">
                <FormField offsetAbsentLabel={indent}>
                    <label style={{ height: '2.3em' }}>
                        {this.renderFormInput()}
                        <Checkbox
                            checked={value}
                            onChange={(this.shouldRenderField() && this.valueChanged) || NOOP}
                            readonly={!this.shouldRenderField()}
                        />
                        <span style={{ marginLeft: '.75em' }}>
                            {label}
                        </span>
                    </label>
                    {this.renderNote()}
                </FormField>
            </div>
        );
    }
}
