import * as React from 'react';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

let LocalFileColumn = React.createClass({
	renderValue: function () {
		let value = this.props.data.fields[this.props.col.path];
		if (!value || !value.filename) return;
		return value.filename;
	},
	render: function () {
		let value = this.props.data.fields[this.props.col.path];
		let href = value && value.url ? value.url : null;
		let label = value && value.filename ? value.filename : null;
		return (
			<ItemsTableCell href={href} padded interior field={this.props.col.type}>
				<ItemsTableValue>{label}</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

export = LocalFileColumn;
