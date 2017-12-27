import React from 'react';
import classnames from 'classnames';

let ListControl = React.createClass({
	propTypes: {
		dragSource: React.PropTypes.func,
		onClick: React.PropTypes.func,
		type: React.PropTypes.oneOf(['check', 'delete', 'sortable']).isRequired,
	},
	renderControl () {
		let icon = 'octicon octicon-';
		let className = classnames('ItemList__control ItemList__control--' + this.props.type, {
			'is-active': this.props.active,
		});
		let tabindex = this.props.type === 'sortable' ? -1 : null;

		if (this.props.type === 'check') {
			icon += 'check';
		}
		if (this.props.type === 'delete') {
			icon += 'trashcan';
		}
		if (this.props.type === 'sortable') {
			icon += 'three-bars';
		}

		let renderButton = (
			<button type="button" onClick={this.props.onClick} className={className} tabIndex={tabindex}>
				<span className={icon} />
			</button>
		);
		if (this.props.dragSource) {
			return this.props.dragSource(renderButton);
		} else {
			return renderButton;
		}
	},
	render () {
		let className = 'ItemList__col--control ItemList__col--' + this.props.type;

		return (
			<td className={className}>
				{this.renderControl()}
			</td>
		);
	},
});

export = ListControl;
