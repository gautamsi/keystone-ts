import * as React from 'react';
import { findDOMNode } from 'react-dom';

import {
    FormField,
    FormInput,
    FormSelect,
    SegmentedControl,
} from 'elemental';

const INVERTED_OPTIONS = [
    { label: 'Matches', value: false },
    { label: 'Does NOT Match', value: true },
];

const MODE_OPTIONS = [
    { label: 'Contains', value: 'contains' },
    { label: 'Exactly', value: 'exactly' },
    { label: 'Begins with', value: 'beginsWith' },
    { label: 'Ends with', value: 'endsWith' },
];

export interface Props {
    filter?: {
        mode?: any; // ref: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
        inverted?: boolean,
        value?: string,
    };
    field?: any;
    onChange?: any;
}

export class TextFilter extends React.Component<Props> {

    static getDefaultValue() {
        return {
            mode: MODE_OPTIONS[0].value,
            inverted: INVERTED_OPTIONS[0].value,
            value: '',
        };
    }

    static defaultProps() {
        return {
            filter: this.getDefaultValue(),
        };
    }
    updateFilter(value) {
        this.props.onChange({ ...this.props.filter, ...value });
    }
    selectMode(e) {
        const mode = e.target.value;
        this.updateFilter({ mode });
        findDOMNode<HTMLElement>(this.refs.focusTarget).focus();
    }
    toggleInverted(inverted) {
        this.updateFilter({ inverted });
        findDOMNode<HTMLElement>(this.refs.focusTarget).focus();
    }
    updateValue(e) {
        this.updateFilter({ value: e.target.value });
    }
    render() {
        const { field, filter } = this.props;
        const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
        const placeholder = field.label + ' ' + mode.label.toLowerCase() + '...';

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
                    <FormSelect
                        onChange={this.selectMode}
                        options={MODE_OPTIONS}
                        value={mode.value}
                    />
                </FormField>
                <FormInput
                    autoFocus
                    onChange={this.updateValue}
                    placeholder={placeholder}
                    ref="focusTarget"
                    value={this.props.filter.value}
                />
            </div>
        );
    }
}
