/**
 * Render the body of a popout
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

export const PopoutBody = React.createClass({
	displayName: 'PopoutBody',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		scrollable: React.PropTypes.bool,
	},
	render () {
		const className = classnames('Popout__body', {
			'Popout__scrollable-area': this.props.scrollable,
		}, this.props.className);
		const props = blacklist(this.props, 'className', 'scrollable');

		return (
			<div className={className} {...props} />
		);
	},
});
