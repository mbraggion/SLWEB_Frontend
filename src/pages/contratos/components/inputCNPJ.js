import PropTypes from 'prop-types';
import React from 'react';
import NumberFormat from 'react-number-format';

import { TextField } from '@material-ui/core/';

export const InputNumber = ({
	value,
	onChange,
	disabled,
	className,
	label,
	Tipo,
}) => {
	return (
		<TextField
			className={className}
			id={`formatted-numberformat-input-${label}`}
			label={label}
			value={value}
			onChange={(e) => onChange(e)}
			name={label}
			disabled={disabled}
			InputProps={{
				inputComponent: NumberFormatCustom,
				inputProps: { Tipo: Tipo },
			}}
			variant='outlined'
		/>
	);
};

const NumberFormatCustom = (props) => {
	const { inputRef, onChange, Tipo, ...other } = props;

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
			allowLeadingZeros={true}
			isNumericString
			allowNegative={false}
			allowEmptyFormatting={false}
			mask={
				Tipo === 'CNPJ'
					? '##.###.###/####-##'
					: Tipo === 'CPF'
					? '###.###.###-##'
					: null
			}
		/>
	);
};

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
