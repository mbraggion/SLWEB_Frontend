import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core/';

export const InputTel = ({ value, onChange, disabled, className }) => {
	return (
		<TextField
			className={className}
			label='Celular'
			value={value}
			onChange={(e) => onChange(e)}
			name='Celular'
			disabled={disabled}
			InputProps={{
				inputComponent: NumberFormatCustom,
			}}
			variant='outlined'
		/>
	);
};

const NumberFormatCustom = (props) => {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			isNumericString
			format='(##) # ####-####'
			mask='_'
		/>
	);
};

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
