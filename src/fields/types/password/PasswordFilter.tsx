import * as React from 'react';

import { SegmentedControl } from 'elemental';

const EXISTS_OPTIONS = [
    { label: 'Is Set', value: true },
    { label: 'Is NOT Set', value: false },
];

export interface Props {
    filter?: {
        exists?: any; // ref: React.PropTypes.oneOf(EXISTS_OPTIONS.map(i => i.value)),
    };
    onChange?: any;
}

export class PasswordFilter extends React.Component<Props> {
    static getDefaultValue() {
        return {
            exists: true,
        };
    }

    static defaultProps() {
        return {
            filter: this.getDefaultValue(),
        };
    }
    toggleExists(value) {
        this.props.onChange({ exists: value });
    }
    render() {
        const { filter } = this.props;

        return (
            <SegmentedControl
                equalWidthSegments
                onChange={this.toggleExists}
                options={EXISTS_OPTIONS}
                value={filter.exists}
            />
        );
    }
}
