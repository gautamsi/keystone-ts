import * as Field from '../Field';
import * as React from 'react';
import {
    FormInput,
    Grid,
} from 'elemental';

const NAME_SHAPE = {
    first: React.PropTypes.string,
    last: React.PropTypes.string,
};

export const NameField = Field.create({
    displayName: 'NameField',
    statics: {
        type: 'Name',
        getDefaultValue: () => ({
            first: '',
            last: '',
        }),
    },
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        path: React.PropTypes.string.isRequired,
        paths: React.PropTypes.shape(NAME_SHAPE).isRequired,
        value: React.PropTypes.shape(NAME_SHAPE).isRequired,
    },

    valueChanged: function (which, event) {
        const { value = {}, path, onChange } = this.props;
        onChange({
            path,
            value: {
                ...value,
                [which]: event.target.value,
            },
        });
    },
    changeFirst: function (event) {
        return this.valueChanged('first', event);
    },
    changeLast: function (event) {
        return this.valueChanged('last', event);
    },
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
    },
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
    },
});
