import * as React from 'react';

import { SegmentedControl } from '../../../admin/client/App/elemental';

const OPTIONS = [
    { label: 'Is Set', value: true },
    { label: 'Is NOT Set', value: false },
];

export interface Props {
    filter?: {
        exists?: any; // ref: React.PropTypes.oneOf(OPTIONS.map(i => i.value)),
    };
    onChange?: any;
}

export class CloudinaryImageFilter extends React.Component<Props> {
    static getDefaultValue() {
        return {
            exists: true,
        };
    }
    static get defaultProps() {
        return {
            filter: this.getDefaultValue(),
        };
    }
    toggleExists = (value) => {
        this.props.onChange({ exists: value });
    };
    render() {
        const { filter } = this.props;

        return (
            <SegmentedControl
                equalWidthSegments
                onChange={this.toggleExists}
                options={OPTIONS}
                value={filter.exists}
            />
        );
    }
}
