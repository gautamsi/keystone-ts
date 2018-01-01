import * as React from 'react';

export class ExplorerRow extends React.Component<Props> {
    getChildContext() {
        return {
            isCollapsed: this.props.isCollapsed,
        };
    }
    render() {
        const { className, gutter, isCollapsed, style = {}, ...incidentalProps } = this.props;
        const __style__ = isCollapsed ? style : {
            display: 'flex',
            flexWrap: 'wrap',
            marginLeft: gutter * -1,
            marginRight: gutter * -1,
            ...style,
        };
        const __className__ = 'ExplorerRow' + (className
            ? ' ' + className
            : '');

        return (
            <div
                {...incidentalProps}
                className={__className__}
                style={__style__}
            />
        );
    }
    static defaultProps() {
        return { gutter: 10 };
    }
}
// ExplorerRow['childContextTypes'] = {
//     isCollapsed: React.PropTypes.bool,
// };
interface Props {
    className?: string;
    gutter?: number;
    style?: string;
    isCollapsed?: boolean
}
