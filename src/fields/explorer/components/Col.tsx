import * as React from 'react';

export const ExplorerCol = (props, context) => {
    const { className, gutter, style = {}, width, ...incidentalProps } = props;
    const { isCollapsed } = context;
    const __style__ = isCollapsed ? style : {
        flex: width ? null : '1 1 0',
        minHeight: 1,
        paddingLeft: gutter,
        paddingRight: gutter,
        width: width || '100%',
        ...style,
    };
    const __className__ = 'ExplorerCol' + (className
        ? ' ' + className
        : '');

    return (
        <div
            {...incidentalProps}
            className={__className__}
            style={__style__}
        />
    );
};
ExplorerCol['contextTypes'] = {
    isCollapsed: React.PropTypes.bool,
};
ExplorerCol['propTypes'] = {
    className: React.PropTypes.string,
    gutter: React.PropTypes.number,
    style: React.PropTypes.string,
    width: React.PropTypes.number,
};
ExplorerCol['defaultProps'] = {
    gutter: 10,
};
