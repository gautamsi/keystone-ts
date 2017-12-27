import React from 'react';
import Field from '../Field';
import { FormInput } from '../../../admin/client/App/elemental';

export = Field.create({
	displayName: 'NumberField',
	statics: {
		type: 'Number',
	},
	valueChanged (event) {
		let newValue = event.target.value;
		if (/^-?\d*\.?\d*$/.test(newValue)) {
			this.props.onChange({
				path: this.props.path,
				value: newValue,
			});
		}
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
