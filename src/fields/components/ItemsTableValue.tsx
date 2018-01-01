import * as React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

export const ItemsTableValue: React.SFC<Props> = ({
    component,
    empty,
    exterior,
    field,
    href,
    interior,
    padded,
    truncate,
    ...props
}) => {
    // TODO remove in the next release
    if (href) {
        console.warn('ItemsTableValue: `href` will be deprecated in the next release, use `to`.');
    }
    const linkRef = props.to || href;
    const Component = linkRef ? Link : component;

    props.className = `${classnames('ItemList__value', (
        field ? `ItemList__value--${field}` : null
    ), {
            'ItemList__link--empty': empty,
            'ItemList__link--exterior': linkRef && exterior,
            'ItemList__link--interior': linkRef && interior,
            'ItemList__link--padded': linkRef && padded,
            'ItemList__value--truncate': truncate,
        }, props.className)}`;
    props.to = linkRef;

    return <Component {...props} />;
};

interface Props {
    className?: any;
    component?: string | any;
    empty?: boolean;
    exterior?: boolean;
    field?: string;
    href?: string;
    interior?: boolean;
    padded?: boolean;
    to?: string;
    truncate?: boolean;
    title?: string;
}

ItemsTableValue.defaultProps = {
    component: 'div',
    truncate: true,
};
