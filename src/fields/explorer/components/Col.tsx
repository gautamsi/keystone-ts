import * as React from 'react';

export const ExplorerCol: React.SFC<Props> = (props, context) => {
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
// ExplorerCol.contextTypes = {
//     isCollapsed: boolean,
// };
interface Props {
    className?: string;
    gutter?: number;
    style?: string;
    width?: number;
    isCollapsed?: any;
}

ExplorerCol.defaultProps = {
    gutter: 10,
};
