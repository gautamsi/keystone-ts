import { css } from 'glamor';
import * as React from 'react';

// NOTE: only accepts InlineGroupSection as a single child

export const InputGroup: React.SFC<Props> = ({
	cssStyles,
    block,
    children,
    className,
    component: Component,
    contiguous,
    ...props
}) => {
    // prepare group className
    props['className'] = css(
        classes.group,
        !!block && classes.block,
        cssStyles
    );
    if (className) {
        props['className'] += (' ' + className);
    }

    // convert children to an array and filter out falsey values
    const buttons = React.Children.toArray(children).filter(i => i);

    // normalize the count
    const count = buttons.length - 1;

    // clone children and apply classNames that glamor can target
    props['children'] = buttons.map((c, idx) => {
        if (!c) return null;

        const isOnlyChild = !count;
        const isFirstChild = !isOnlyChild && idx === 0;
        const isLastChild = !isOnlyChild && idx === count;
        const isMiddleChild = !isOnlyChild && !isFirstChild && !isLastChild;

        let position;
        if (isOnlyChild) position = 'only';
        if (isFirstChild) position = 'first';
        if (isLastChild) position = 'last';
        if (isMiddleChild) position = 'middle';

        return React.cloneElement(c as any, {
            contiguous: contiguous,
            position,
        });
    });

    return <Component {...props} />;
};

export interface Props {
    block?: boolean;
    component?: any;
    contiguous?: boolean;
    cssStyles?: {
        _definition?: any;
        _name?: string;
    };
    className?: any;
    children?: any;
}

InputGroup.defaultProps = {
    component: 'div',
};

const classes = {
    group: {
        display: 'inline-flex',
    },
    block: {
        display: 'flex',
    },
};
