import { css } from 'glamor';
import * as React from 'react';

import colors from './colors';
import { sizes } from './sizes';
import classes from './styles';
import { octicons } from './octicons';

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

export const Glyph: React.SFC<Props> = ({
	cssStyles,
    color,
    component: Component,
    name,
    size,
    ...props
}) => {
    const colorIsValidType = Object.keys(colors).indexOf(color) >= 0;
    props.className = css(
        classes.glyph,
        colorIsValidType && classes['color__' + color],
        classes['size__' + size],
        cssStyles
    ) + ` ${octicons[name]}`;
    if (props.className) {
        props.className += (' ' + props.className);
    }

    // support random color strings
    props.style = {
        color: !colorIsValidType ? color : null,
        ...props.style,
    };

    return <Component {...props} />;
};

export interface Props {
    color?: string; // keyof colors | string; // support random color strings
    cssStyles?: {
        _definition?: any,
        _name?: string,
    };
    name: string; // keyof octicons;
    size?: string; // keyof sizes;
    component?: string;
    className?: string;
    style?: any;
}


Glyph.defaultProps = {
    component: 'i',
    color: 'inherit',
    size: 'small',
};
