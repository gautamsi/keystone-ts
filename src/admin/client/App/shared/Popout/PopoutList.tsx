/**
 * Render a popout list. Can also use PopoutListItem and PopoutListHeading
 */

import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

const PopoutList = React.createClass({
	displayName: 'PopoutList',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
	},
	render () {
		const className = classnames('PopoutList', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	},
});

export = PopoutList;

// expose the child to the top level export
export const Item = require('./PopoutListItem');
export const Heading = require('./PopoutListHeading');
