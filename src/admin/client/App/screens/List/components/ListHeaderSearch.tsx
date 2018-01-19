import { css } from 'glamor';
import * as React from 'react';
import { theme } from '../../../../theme';
import { darken } from '../../../../utils/color';

import { FormInput, Glyph } from '../../../elemental';

export const ListHeaderSearch: React.SFC<Props> = ({
	focusInput,
    handleChange,
    handleClear,
    handleKeyup,
    value,
    ...props
}) => {
    return (
        <div {...props} className={`${css(classes.wrapper)}`}>
            <FormInput
                data-search-input-field
                onChange={handleChange}
                onKeyUp={handleKeyup}
                placeholder="Search"
                value={value}
            />
            <button
                className={`${css(classes.icon, !!value.length && classes.iconWhenClear)}`}
                data-search-input-field-clear-icon
                disabled={!value.length}
                onClick={e => value.length && handleClear(e)}
                title="Clear search query"
                type="button"
            >
                <Glyph name={value.length ? 'x' : 'search'} />
            </button>
        </div>
    );
    // value.length && handleClear
};

export interface Props {
    focusInput?: boolean;
    handleChange: any;
    handleClear: any;
    handleKeyup: any;
    value?: string;
}

const clearHoverAndFocusStyles = {
    color: theme.color.danger,
    outline: 0,
    textDecoration: 'none',
};

const classes = {
    wrapper: {
        position: 'relative',
    },
    icon: {
        background: 'none',
        border: 'none',
        color: theme.color.gray40,
        height: '100%',
        position: 'absolute',
        right: 0,
        textAlign: 'center',
        top: 0,
        width: '2.2em',
        zIndex: 2, // above the form field on focus
    },
    iconWhenClear: {
        ':hover': clearHoverAndFocusStyles,
        ':focus': clearHoverAndFocusStyles,
        ':active': {
            color: darken(theme.color.danger, 10),
        },
    },
};
