import { css } from 'glamor';
import * as React from 'react';
import classes from './styles';

// NOTE: Inline Group Section accepts a single child

export const InputGroupSection: React.SFC<Props> = ({
	active,
    cssStyles,
    children,
    className,
    contiguous,
    grow,
    position,
    ...props
}) => {
    // evaluate position
    const separate = position === 'last' || position === 'middle';

    // A `contiguous` section must manipulate it's child directly
    // A separate (default) section just wraps the child
    return contiguous ? React.cloneElement(children, {
        cssStyles: [
            classes.contiguous,
            classes['contiguous__' + position],
            active ? classes.active : null,
            grow ? classes.grow : null,
            cssStyles,
        ],
        ...props,
    }) : (
            <div className={`${css(
                !!grow && classes.grow,
                !!separate && classes.separate,
                cssStyles
            )}`} {...props}>
                {children}
            </div>
        );
};

export interface Props {
    active?: boolean; // buttons only
    children?: any;
    contiguous?: boolean;
    grow?: boolean;
    position?: 'first' | 'last' | 'middle' | 'only';
    cssStyles?: any;
    className?: any;
}
