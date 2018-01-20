import * as Field from '../FieldBase';
import * as React from 'react';
import {
    FormInput,
    Grid,
} from '../../../admin/client/App/elemental';
import { FieldPropsBase, FieldBase } from '../FieldBase';

// tslint:disable-next-line:class-name
export interface NameShape {
    first?: string;
    last?: string;
}

export interface Props extends FieldPropsBase {
    onChange: any;
    path: string;
    paths: NameShape;
    value: NameShape;
}

export class NameField extends FieldBase<Props> {
    static displayName: string = 'NameField';
    static type: string = 'Name';
    static getDefaultValue() {
        return {
            first: '',
            last: '',
        };
    }

    valueChanged = (which, event?) => { // ref: event may not be optional
        const { value = {}, path, onChange } = this.props;
        onChange({
            path,
            value: {
                ...value,
                [which]: event.target.value,
            },
        });
    }
    changeFirst = (event) => {
        return this.valueChanged('first', event);
    };
    changeLast = (event) => {
        return this.valueChanged('last', event);
    };
    renderValue() {
        const inputStyle = { width: '100%' };
        const { value = {} } = this.props;

        return (
            <Grid.Row small="one-half" gutter={10}>
                <Grid.Col>
                    <FormInput noedit style={inputStyle}>
                        {value.first}
                    </FormInput>
                </Grid.Col>
                <Grid.Col>
                    <FormInput noedit style={inputStyle}>
                        {value.last}
                    </FormInput>
                </Grid.Col>
            </Grid.Row>
        );
    }
    renderField() {
        const { value = {}, paths, autoFocus } = this.props;
        return (
            <Grid.Row small="one-half" gutter={10}>
                <Grid.Col>
                    <FormInput
                        autoFocus={autoFocus}
                        autoComplete="off"
                        name={this.getInputName(paths.first)}
                        onChange={this.changeFirst}
                        placeholder="First name"
                        value={value.first}
                    />
                </Grid.Col>
                <Grid.Col>
                    <FormInput
                        autoComplete="off"
                        name={this.getInputName(paths.last)}
                        onChange={this.changeLast}
                        placeholder="Last name"
                        value={value.last}
                    />
                </Grid.Col>
            </Grid.Row>
        );
    }
}
