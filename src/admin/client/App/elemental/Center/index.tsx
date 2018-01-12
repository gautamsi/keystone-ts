import * as React from 'react';
import { css } from 'glamor';
import classes from './styles';
import * as PropTypes from 'prop-types';

export const Center: React.SFC<Props> = ({
	Component: Component,
    height,
    ...props
}) => {
    props.className = `${css(classes.center, props.className as any)}`;
    props.style = { height, ...props.style };

    return <Component {...props} />;
};
export interface Props {
    Component?: PropTypes.func | string;
    height?: number | string;
    className?: string;
    style?: any;
    component?: string;
}

Center.defaultProps = {
	component: 'div',
	height: 'auto',
};
