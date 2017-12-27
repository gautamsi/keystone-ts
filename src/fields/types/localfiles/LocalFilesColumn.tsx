let React = require('react');

let LocalFilesColumn = React.createClass({
	renderValue: function () {
		let value = this.props.data.fields[this.props.col.path];
		if (value.length === 0) return '';
		let fileOrFiles = (value.length > 1) ? 'Files' : 'File';
		return value.length + ' ' + fileOrFiles;
	},
	render: function () {
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--local-files">{this.renderValue()}</div>
			</td>
		);
	},
});

export = LocalFilesColumn;
