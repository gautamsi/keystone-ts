import { css } from 'glamor';
import * as React from 'react';
import { DrilldownItem } from './DrilldownItem';

interface Props {
    items: Array<{
        href: string,
        label: string,
        separate: boolean
    }>;
    className: any;
}

export const Drilldown: React.SFC<Props> = ({ items, ...props }) => {
    props.className = css(classes.drilldown, props.className);

    return (
        <ul {...props}>
            {items.map((item, idx) => (
                <DrilldownItem
                    href={item.href}
                    key={idx}
                    label={item.label}
                    separate={idx < items.length - 1}
                />
            ))}
        </ul>
    );
};

const classes = {
    drilldown: {
        display: 'inline-block',
        listStyle: 'none',
        margin: 0,
        padding: 0,
    },
};
