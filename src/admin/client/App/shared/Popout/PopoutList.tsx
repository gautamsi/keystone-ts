/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

export const PopoutList = React.createClass({
    displayName: 'PopoutList',
    propTypes: {
        children: React.PropTypes.node.isRequired,
        className: React.PropTypes.string,
    },
    render() {
        const className = classnames('PopoutList', this.props.className);
        const props = blacklist(this.props, 'className');

        return (
            <div className={className} {...props} />
        );
    },
});

// expose the child to the top level export
export { PopoutListItem as Item } from './PopoutListItem';
export { PopoutListHeading as Heading } from './PopoutListHeading';
