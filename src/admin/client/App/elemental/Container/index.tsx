import { css } from 'glamor';
import * as React from 'react';
import classes from './styles';
import sizes from './sizes';

export const Container: React.SFC<Props> = ({
    clearFloatingChildren,
    component: Component,
    width,
    ...props
}) => {
    props.className = css(
        classes.container,
        classes[width],
        clearFloatingChildren ? classes.clearfix : null,
        props.className
    );

    return <Component {...props} />;
};

export interface Props {
    clearFloatingChildren?: boolean;
    component?: string | any;
    width?: any; // keyof sizes;
    className?: any;
}

Container.defaultProps = {
    component: 'div',
    width: 'large',
};
