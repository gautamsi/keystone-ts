import * as React from 'react';
import { SegmentedControl } from 'elemental';

const VALUE_OPTIONS = [
    { label: 'Is Checked', value: true },
    { label: 'Is NOT Checked', value: false },
];

interface Props {
    filter?: {
        value?: boolean,
    };
    onChange?: any;
}

export class BooleanFilter extends React.Component<Props> {
    static getDefaultValue() {
        return {
            value: true,
        };
    }
    static defaultProps() {
        return {
            filter: this.getDefaultValue(),
        };
    }
    updateValue(value) {
        this.props.onChange({ value });
    }
    render() {
        return <SegmentedControl equalWidthSegments options={VALUE_OPTIONS} value={this.props.filter.value} onChange={this.updateValue} />;
    }
}
