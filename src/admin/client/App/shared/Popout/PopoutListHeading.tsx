/**
 * Render a popout list heading
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

export const PopoutListHeading = React.createClass({
	displayName: 'PopoutListHeading',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
	},
	render () {
		const className = classnames('PopoutList__heading', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	},
});
