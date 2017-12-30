import { css } from 'glamor';
import * as React from 'react';
import { DrilldownItem } from './DrilldownItem';

export function Drilldown({ className, items, ...props }) {
    props.className = css(classes.drilldown, className);

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
}

Drilldown['propTypes'] = {
    items: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            href: React.PropTypes.string.isRequired,
            label: React.PropTypes.string.isRequired,
            separate: React.PropTypes.bool, // FIXME verb; could be better
        })
    ).isRequired,
};

const classes = {
    drilldown: {
        display: 'inline-block',
        listStyle: 'none',
        margin: 0,
        padding: 0,
    },
};
