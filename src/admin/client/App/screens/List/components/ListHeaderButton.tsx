import { css } from 'glamor';
import * as React from 'react';
import { DropdownButton, Glyph } from '../../../elemental';

export interface Props {
    glyph: string;
    className?: string;
    label?: string;
    active?: any;
    id?: any;
    onClick?: any;
}

export const ListHeaderButton: React.SFC<Props> = ({ className, label, glyph, ...props }) => {
    return (
        <DropdownButton block {...props}>
            <Glyph name={glyph} cssStyles={classes.glyph as any} />
            <span className={`{css(classes.label)}`}>{label}</span>
        </DropdownButton>
    );
};

// show an icon on small screens where real estate is precious
// otherwise render the label
const classes = {
    glyph: {
        'display': 'none',

        '@media (maxWidth: 500px)': {
            display: 'inline-block',
        },
    },
    label: {
        'display': 'inline-block',

        '@media (maxWidth: 500px)': {
            display: 'none',
        },
    },
};
