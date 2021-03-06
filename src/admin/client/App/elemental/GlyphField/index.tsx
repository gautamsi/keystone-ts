/* eslint quote-props: ["error", "as-needed"] */

import * as React from 'react';
import { FormField as Field } from '../../elemental';
import { Glyph } from '../Glyph';

export const GlyphField: React.SFC<Props> = ({
	children,
    glyph,
    glyphColor,
    glyphSize,
    position,
    ...props
}) => {
    const isLeft = position === 'left';
    const isRight = position === 'right';

    const glyphStyles: any = {};
    if (isLeft) glyphStyles.marginRight = '0.5em';
    if (isRight) glyphStyles.marginLeft = '0.5em';

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
        <Field cssStyles={classes.wrapper} {...props}>
            {isLeft && icon}
            {children}
            {isRight && icon}
        </Field>
    );
};

// For props "glyph", "glyphColor", and "glyphSize":
// prop type validation will occur within the Glyph component, no need to
// duplicate, just pass it through.
export interface Props {
    glyph?: string;
    glyphColor?: string;
    glyphSize?: string;
    position?: 'left'| 'right';
}


GlyphField.defaultProps = {
    position: 'left',
};

const classes = {
    wrapper: {
        alignItems: 'center',
        display: 'flex',
    },
    glyph: {
        display: 'inline-block',
        marginTop: '-0.125em', // fix icon alignment
        verticalAlign: 'middle',
    },
};
