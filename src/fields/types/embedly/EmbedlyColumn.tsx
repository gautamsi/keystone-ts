let React = require('react');

let EmbedlyColumn = React.createClass({
	renderValue: function () {
		let value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		return <a href={value.url} target="_blank">{value.url}</a>;
	},
	render: function () {
		return (
			<td>
				<div className="ItemList__value">{this.renderValue()}</div>
			</td>
		);
	},
});

export = EmbedlyColumn;
