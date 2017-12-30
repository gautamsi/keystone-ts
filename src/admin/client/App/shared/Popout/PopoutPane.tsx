/**
 * Render a popout pane, calls props.onLayout when the component mounts
 */

import * as React from 'react';
import * as blacklist from 'blacklist';
import * as classnames from 'classnames';

export const PopoutPane = React.createClass({
	displayName: 'PopoutPane',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		onLayout: React.PropTypes.func,
	},
	getDefaultProps () {
		return {
			onLayout: () => {},
		};
	},
	componentDidMount () {
		this.props.onLayout(this.refs.el.offsetHeight);
	},
	render () {
		const className = classnames('Popout__pane', this.props.className);
		const props = blacklist(this.props, 'className', 'onLayout');

		return (
			<div ref="el" className={className} {...props} />
		);
	},
});
