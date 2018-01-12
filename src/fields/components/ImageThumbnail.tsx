import { css } from 'glamor';
import * as React from 'react';
import { Spinner } from 'elemental';
import { theme } from '../../admin/client/theme';

// FIXME static octicon classes leaning on Elemental to avoid duplicate
// font and CSS; inflating the project size

const ICON_MAP = {
    loading: '',
    remove: 'mega-octicon octicon-trashcan',
    upload: 'mega-octicon octicon-cloud-upload',
};

export const ImageThumbnail: React.SFC<Props> = ({ component, mask, ...props }) => {
    const maskUI = mask ? (
        <div className={css(classes.mask) + ` ${ICON_MAP[mask]}`}>
            {mask === 'loading'
                ? <Spinner color="inverted" />
                : null}
        </div>
    ) : null;

    // apply hover and focus styles only when using an anchor
    props.className = css(
        classes.base,
        component === 'a' ? classes.anchor : null,
        props.className
    );

    // append the mask UI to children
    props.children = [].concat(props.children, [maskUI]);

    return React.createElement(component, props);
};

export interface Props {
    component?: string | any;
    mask?: 'loading' | 'remove' | 'upload';
    className?: any;
    href?: any;
    onClick?: any;
    target?: any;
    style?: any;
}

ImageThumbnail.defaultProps = {
    component: 'span',
};

/* eslint quote-props: ["error", "as-needed"] */
const GUTTER_WIDTH = 4;
const hoverAndFocusStyles = {
    borderColor: theme.input.border.color.focus,
    outline: 'none',
};
const classes = {
    base: {
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.default,
        border: `1px solid ${theme.input.border.color.default}`,
        display: 'inline-block',
        height: 'auto',
        lineHeight: '1',
        maxWidth: '100%',
        padding: GUTTER_WIDTH,
        position: 'relative',
    },
    anchor: {
        ':hover': hoverAndFocusStyles,
        ':focus': {
            ...hoverAndFocusStyles,
            boxShadow: theme.input.boxShadowFocus,
        },
    },

    // mask
    mask: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        bottom: GUTTER_WIDTH,
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        left: GUTTER_WIDTH,
        lineHeight: 90,
        overflow: 'hidden',
        position: 'absolute',
        right: GUTTER_WIDTH,
        textAlign: 'center',
        top: GUTTER_WIDTH,
    },
};
