import { FormInput } from 'elemental';
import Field from '../Field';
import React, { PropTypes } from 'react';

export = Field.create({
	displayName: 'MoneyField',
	propTypes: {
		onChange: PropTypes.func.isRequired,
		path: PropTypes.string.isRequired,
		value: PropTypes.number,
	},
	statics: {
		type: 'Money',
	},

	valueChanged (event) {
		let newValue = event.target.value.replace(/[^\d\s\,\.\$€£¥]/g, '');
		if (newValue === this.props.value) return;

		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},
	renderField () {
		return (
			<FormInput
				autoComplete="off"
				name={this.getInputName(this.props.path)}
				onChange={this.valueChanged}
				ref="focusTarget"
				value={this.props.value}
			/>
		);
	},

});
