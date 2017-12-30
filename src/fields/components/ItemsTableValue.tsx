import * as React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';

export function ItemsTableValue({
	className,
    component,
    empty,
    exterior,
    field,
    href,
    interior,
    padded,
    to,
    truncate,
    ...props
}) {
    // TODO remove in the next release
    if (href) {
        console.warn('ItemsTableValue: `href` will be deprecated in the next release, use `to`.');
    }
    const linkRef = to || href;
    const Component = linkRef ? Link : component;

    props.className = classnames('ItemList__value', (
        field ? `ItemList__value--${field}` : null
    ), {
            'ItemList__link--empty': empty,
            'ItemList__link--exterior': linkRef && exterior,
            'ItemList__link--interior': linkRef && interior,
            'ItemList__link--padded': linkRef && padded,
            'ItemList__value--truncate': truncate,
        }, className);
    props.to = linkRef;

    return <Component {...props} />;
}

ItemsTableValue['propTypes'] = {
    component: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func,
    ]),
    empty: React.PropTypes.bool,
    exterior: React.PropTypes.bool, // FIXME this should be "external" e.g. an external link
    field: React.PropTypes.string,
    href: React.PropTypes.string, // TODO remove in next release
    interior: React.PropTypes.bool, // FIXME this should be "internal" e.g. an internal link
    padded: React.PropTypes.bool,
    to: React.PropTypes.string,
    truncate: React.PropTypes.bool,
};
ItemsTableValue['defaultProps'] = {
    component: 'div',
    truncate: true,
};
