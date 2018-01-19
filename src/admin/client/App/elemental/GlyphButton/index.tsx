/* eslint quote-props: ["error", "as-needed"] */

import * as React from 'react';
import { Button } from '../../elemental';
import { Glyph } from '../Glyph';

export const GlyphButton: React.SFC<Props> = ({
	children,
    glyph,
    glyphColor,
    glyphSize,
    glyphStyle,
    position,
    ...props
}) => {
    const isDefault = position === 'default';
    const isLeft = position === 'left';
    const isRight = position === 'right';

    const offset: any = {};
    if (isLeft) offset.marginRight = '0.5em';
    if (isRight) offset.marginLeft = '0.5em';

    const glyphStyles = {
        ...offset,
        ...glyphStyle,
    };

    const icon = (
        <Glyph
            cssStyles={classes.glyph}
            color={glyphColor}
            name={glyph}
            size={glyphSize}
            style={glyphStyles}
        />
    );

    return (
        <Button {...props}>
            {(isDefault || isLeft) && icon}
            {children}
            {isRight && icon}
        </Button>
    );
};

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
export interface Props {
    glyph?: string;
    glyphColor?: string;
    glyphSize?: string;
    glyphStyle?: any;
    position?: 'default' | 'left' | 'right';
    component?: any;
    style?: any;
    to?: any;
    variant?: any;
    color?: any;
    onClick?: any;
    cssStyles?: any;
    className?: any;
    title?: any;
}

GlyphButton.defaultProps = {
    glyphStyle: {},
    position: 'default', // no margin, assumes no children
};

const classes = {
    glyph: {
        display: 'inline-block',
        marginTop: '-0.125em', // fix icon alignment
        verticalAlign: 'middle',
    },
};
