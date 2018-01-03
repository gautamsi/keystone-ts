import * as React from 'react';
import Select from 'react-select';
import { FormInput } from 'elemental';
import { FieldBase, FieldPropsBase } from '../FieldBase';

interface Props extends FieldPropsBase {
    numeric?: any;
    ops?: any;
}

/**
 * TODO:
 * - Custom path support
 */

export class SelectField extends FieldBase<Props> {

    static displayName: string = 'SelectField';
    static type: string = 'Select';

    valueChanged(newValue) {
        // TODO: This should be natively handled by the Select component
        if (this.props.numeric && typeof newValue === 'string') {
            newValue = newValue ? Number(newValue) : undefined;
        }
        this.props.onChange({
            path: this.props.path,
            value: newValue,
        });
    }

    renderValue() {
        const { ops, value } = this.props;
        const selected = ops.find(opt => opt.value === value);

        return (
            <FormInput noedit>
                {selected ? selected.label : null}
            </FormInput>
        );
    }

    renderField() {
        const { numeric, ops, path, value: val } = this.props;

        // TODO: This should be natively handled by the Select component
        const options = (numeric)
            ? ops.map(function (i) {
                return { label: i.label, value: String(i.value) };
            })
            : ops;
        const value = (typeof val === 'number')
            ? String(val)
            : val;

        return (
            <div>
                {/* This input element fools Safari's autocorrect in certain situations that completely break react-select */}
                <input type="text" style={{ position: 'absolute', width: 1, height: 1, zIndex: -1, opacity: 0 }} tabIndex={-1} />
                <Select
                    simpleValue
                    name={this.getInputName(path)}
                    value={value}
                    options={options}
                    onChange={this.valueChanged}
                />
            </div>
        );
    }
}
