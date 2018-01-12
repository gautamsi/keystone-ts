import * as React from 'react';
import { findDOMNode } from 'react-dom';

import {
    FormField,
    FormInput,
    FormSelect,
    Grid,
} from 'elemental';

const MODE_OPTIONS = [
    { label: 'Exactly', value: 'equals' },
    { label: 'Greater Than', value: 'gt' },
    { label: 'Less Than', value: 'lt' },
    { label: 'Between', value: 'between' },
];

const PRESENCE_OPTIONS = [
    { label: 'At least one element', value: 'some' },
    { label: 'No element', value: 'none' },
];

export interface Props {
    filter?: {
        mode?: any; // ref: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
        presence?: any; // ref: React.PropTypes.oneOf(PRESENCE_OPTIONS.map(i => i.value)),
        value?: number | string | {
            min?: number;
            max?: number;
        };
    };
    onChange?: any;
}

export class NumberArrayFilter extends React.Component<Props> {

    static getDefaultValue() {
        return {
            mode: MODE_OPTIONS[0].value,
            presence: PRESENCE_OPTIONS[0].value,
            value: '',
        };
    }

    static defaultProps() {
        return {
            filter: this.getDefaultValue(),
        };
    }
    // Returns a function that handles a specific type of onChange events for
    // either 'minValue', 'maxValue' or simply 'value'
    handleValueChangeBuilder(type) {
        return (e) => {
            switch (type) {
                case 'minValue':
                    this.updateFilter({
                        value: {
                            min: e.target.value,
                            max: (this.props.filter.value as any).max,
                        },
                    });
                    break;
                case 'maxValue':
                    this.updateFilter({
                        value: {
                            min: (this.props.filter.value as any).min,
                            max: e.target.value,
                        },
                    });
                    break;
                case 'value':
                    this.updateFilter({
                        value: e.target.value,
                    });
                    break;
            }
        };
    }
    // Update the props with this.props.onChange
    updateFilter(changedProp) {
        this.props.onChange({ ...this.props.filter, ...changedProp });
    }
    // Update the filter mode
    selectMode(e) {
        const mode = e.target.value;
        this.updateFilter({ mode });
        findDOMNode<HTMLElement>(this.refs.focusTarget).focus();
    }
    // Update the presence selection
    selectPresence(e) {
        const presence = e.target.value;
        this.updateFilter({ presence });
        findDOMNode<HTMLElement>(this.refs.focusTarget).focus();
    }
    // Render the controls, showing two inputs when the mode is "between"
    renderControls(presence, mode) {
        let controls;
        const placeholder = presence.label + ' is ' + mode.label.toLowerCase() + '...';

        if (mode.value === 'between') {
            // Render "min" and "max" input
            controls = (
                <Grid.Row xsmall="one-half" gutter={10}>
                    <Grid.Col>
                        <FormInput
                            onChange={this.handleValueChangeBuilder('minValue')}
                            placeholder="Min."
                            ref="focusTarget"
                            type="number"
                            value={(this.props.filter.value as any).min}
                        />
                    </Grid.Col>
                    <Grid.Col>
                        <FormInput
                            onChange={this.handleValueChangeBuilder('maxValue')}
                            placeholder="Max."
                            type="number"
                            value={(this.props.filter.value as any).max}
                        />
                    </Grid.Col>
                </Grid.Row>
            );
        } else {
            // Render one number input
            controls = (
                <FormInput
                    onChange={this.handleValueChangeBuilder('value')}
                    placeholder={placeholder}
                    ref="focusTarget"
                    type="number"
                    value={this.props.filter.value}
                />
            );
        }

        return controls;
    }
    render() {
        const { filter } = this.props;
        // Get mode and presence based on their values with .filter
        const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
        const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];

        return (
            <div>
                <FormField>
                    <FormSelect
                        onChange={this.selectPresence}
                        options={PRESENCE_OPTIONS}
                        value={presence.value}
                    />
                </FormField>
                <FormField>
                    <FormSelect
                        onChange={this.selectMode}
                        options={MODE_OPTIONS}
                        value={mode.value}
                    />
                </FormField>
                {this.renderControls(presence, mode)}
            </div>
        );
    }
}
