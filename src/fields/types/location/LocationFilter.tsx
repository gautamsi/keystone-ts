import * as React from 'react';
import { findDOMNode } from 'react-dom';

import {
    FormField,
    FormInput,
    Grid,
    SegmentedControl,
} from '../../../admin/client/App/elemental';

const INVERTED_OPTIONS = [
    { label: 'Matches', value: false },
    { label: 'Does NOT Match', value: true },
];

export interface Props {
    filter?: {
        inverted?: boolean;
        street?: string;
        city?: string;
        state?: string;
        code?: string;
        country?: string;
    };
    onChange?: any;
}

export class TextFilter extends React.Component<Props> {

    static getDefaultValue() {
        return {
            inverted: INVERTED_OPTIONS[0].value,
            street: undefined,
            city: undefined,
            state: undefined,
            code: undefined,
            country: undefined,
        };
    }

    static get defaultProps() {
        return {
            filter: this.getDefaultValue(),
        };
    }
    updateFilter(key, val) {
        const update = {};
        update[key] = val;
        this.props.onChange(Object.assign(this.props.filter, update));
    }
    toggleInverted = (value) => {
        this.updateFilter('inverted', value);
        findDOMNode<HTMLElement>(this.refs.focusTarget).focus();
    };
    updateValue = (e) => {
        this.updateFilter(e.target.name, e.target.value);
    };
    render() {
        const { filter } = this.props;

        return (
            <div>
                <FormField>
                    <SegmentedControl
                        equalWidthSegments
                        onChange={this.toggleInverted}
                        options={INVERTED_OPTIONS}
                        value={filter.inverted}
                    />
                </FormField>
                <FormField>
                    <FormInput
                        autoFocus
                        name="street"
                        onChange={this.updateValue}
                        placeholder="Address"
                        ref="focusTarget"
                        value={filter.street}
                    />
                </FormField>
                <Grid.Row gutter={10}>
                    <Grid.Col xsmall="two-thirds">
                        <FormInput
                            name="city"
                            onChange={this.updateValue}
                            placeholder="City"
                            style={{ marginBottom: '1em' }}
                            value={filter.city}
                        />
                    </Grid.Col>
                    <Grid.Col xsmall="one-third">
                        <FormInput
                            name="state"
                            onChange={this.updateValue}
                            placeholder="State"
                            style={{ marginBottom: '1em' }}
                            value={filter.state}
                        />
                    </Grid.Col>
                    <Grid.Col xsmall="one-third" style={{ marginBottom: 0 }}>
                        <FormInput
                            name="code"
                            onChange={this.updateValue}
                            placeholder="Postcode"
                            value={filter.code}
                        />
                    </Grid.Col>
                    <Grid.Col xsmall="two-thirds" style={{ marginBottom: 0 }}>
                        <FormInput
                            name="country"
                            onChange={this.updateValue}
                            placeholder="Country"
                            value={filter.country}
                        />
                    </Grid.Col>
                </Grid.Row>
            </div>
        );
    }
}
