import * as React from 'react';
import classNames from 'classnames';

export const ToolbarSection: React.SFC<{ left?: boolean, right?: boolean, className?: any }> = ({ left, right, ...props }) => {
    props.className = classNames('Toolbar__section', {
        'Toolbar__section--left': left,
        'Toolbar__section--right': right,
    }, props.className);

    return <div {...props} />;
};
