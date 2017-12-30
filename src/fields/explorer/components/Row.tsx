import * as React from 'react';

export class ExplorerRow extends React.Component {
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
}
ExplorerRow['childContextTypes'] = {
    isCollapsed: React.PropTypes.bool,
};
ExplorerRow['propTypes'] = {
    className: React.PropTypes.string,
    gutter: React.PropTypes.number,
    style: React.PropTypes.string,
};
ExplorerRow['defaultProps'] = {
    gutter: 10,
};
