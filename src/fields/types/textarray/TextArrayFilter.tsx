import * as React from 'react';
import { findDOMNode } from 'react-dom';

import {
    FormField,
    FormInput,
    FormSelect,
} from '../../../admin/client/App/elemental';

const MODE_OPTIONS = [
    { label: 'Contains', value: 'contains' },
    { label: 'Exactly', value: 'exactly' },
    { label: 'Begins with', value: 'beginsWith' },
    { label: 'Ends with', value: 'endsWith' },
];

const PRESENCE_OPTIONS = [
    { label: 'At least one element', value: 'some' },
    { label: 'No element', value: 'none' },
];

export interface Props {
    filter?: {
        mode?: any; // ref: React.PropTypes.oneOf(MODE_OPTIONS.map(i => i.value)),
        presence?: any; // ref: React.PropTypes.oneOf(PRESENCE_OPTIONS.map(i => i.value)),
        value?: string;
    };
    onChange?: any;
}

export class TextArrayFilter extends React.Component<Props> {

    static getDefaultValue() {
        return {
            mode: MODE_OPTIONS[0].value,
            presence: PRESENCE_OPTIONS[0].value,
            value: '',
        };
    }

    static get defaultProps() {
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
    selectPresence(e) {
        const presence = e.target.value;
        this.updateFilter({ presence });
        findDOMNode<HTMLElement>(this.refs.focusTarget).focus();
    }
    updateValue(e) {
        this.updateFilter({ value: e.target.value });
    }
    render() {
        const { filter } = this.props;
        const mode = MODE_OPTIONS.filter(i => i.value === filter.mode)[0];
        const presence = PRESENCE_OPTIONS.filter(i => i.value === filter.presence)[0];
        const beingVerb = mode.value === 'exactly' ? ' is ' : ' ';
        const placeholder = presence.label + beingVerb + mode.label.toLowerCase() + '...';

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
