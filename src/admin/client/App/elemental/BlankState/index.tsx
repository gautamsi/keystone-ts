import { css } from 'glamor';
import * as React from 'react';
import { theme } from '../../../theme';

export const BlankState: React.SFC<Props> = ({
    children,
    heading,
    component: Component,
    ...props
}) => {
    props.className = css(
        classes.container,
        props.className
    );

    return (
        <Component {...props}>
            {!!heading && <h2 data-e2e-blank-state-heading className={`${css(classes.heading)}`}>{heading}</h2>}
            {children}
        </Component>
    );
};

export interface Props {
    component?: any;
    heading?: string;
    className?: any;
    style?: any;
}

BlankState.defaultProps = {
    component: 'div',
};

/* eslint quote-props: ["error", "as-needed"] */

const classes = {
    container: {
        backgroundColor: theme.blankstate.background,
        borderRadius: theme.blankstate.borderRadius,
        color: theme.blankstate.color,
        paddingBottom: theme.blankstate.paddingVertical,
        paddingLeft: theme.blankstate.paddingHorizontal,
        paddingRight: theme.blankstate.paddingHorizontal,
        paddingTop: theme.blankstate.paddingVertical,
        textAlign: 'center',
    },

    heading: {
        color: 'inherit',

        ':last-child': {
            marginBottom: 0,
        },
    },
};
