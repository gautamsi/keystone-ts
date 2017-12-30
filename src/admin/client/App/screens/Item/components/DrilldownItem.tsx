import { css } from 'glamor';
import * as React from 'react';
import { Link } from 'react-router';
import { Button, Glyph } from 'elemental';

import { theme } from '../../../../theme';

export function DrilldownItem({ className, href, label, separate, separator, style, ...props }) {
    props.className = css(classes.item, className);

    // remove horizontal padding
    const styles = {
        paddingLeft: 0,
        paddingRight: 0,
        ...style,
    };

    return (
        <li {...props}>
            <Button
                component={Link}
                style={styles}
                to={href}
                variant="link"
            >
                {label}
            </Button>
            {separate && (
                <span className={css(classes.separator)}>
                    {separator}
                </span>
            )}
        </li>
    );
}

DrilldownItem.propTypes = {
    href: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    separate: React.PropTypes.bool, // FIXME verb; could be better
    separator: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
    ]),
};
DrilldownItem.defaultProps = {
    separator: <Glyph name="chevron-right" />,
};

const classes = {
    item: {
        display: 'inline-block',
        margin: 0,
        padding: 0,
        verticalAlign: 'middle',
    },
    separator: {
        color: theme.color.gray40,
        marginLeft: '0.5em',
        marginRight: '0.5em',
    },
};
