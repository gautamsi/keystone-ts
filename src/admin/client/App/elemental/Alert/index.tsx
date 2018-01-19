import { css } from 'glamor';
import * as React from 'react';
import classes from './styles';
import colors from './colors';

// clone children if a class exists for the tagname
const cloneWithClassnames = (c) => {
    const type = c.type && c.type.displayName
        ? c.type.displayName
        : c.type || null;

    if (!type || !classes[type]) return c;

    return React.cloneElement(c, {
        className: css(classes[type]),
    });
};

export const Alert: React.SFC<Props> = ({
	children,
    className,
    color,
    component: Component,
    ...props
}) => {
    props['className'] = css(
        classes.alert,
        classes[color],
        className
    );
    props['children'] = React.Children.map(children, cloneWithClassnames);

    return <Component {...props} data-alert-type={color} />;
};

export interface Props {
    color: 'danger' | 'error' | 'info' | 'success' | 'warning';
    component: any;
    className?: any;
    children?: any;
}

Alert.defaultProps = {
    component: 'div',
};
