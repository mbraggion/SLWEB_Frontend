import React, { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

import { TextField } from '@material-ui/core/';

let TipoCliente = 'J';

export const InputCNPJ = ({ value, onChange, Tipo, disabled }) => {
	useEffect(() => {
		TipoCliente = Tipo;
	}, [Tipo]);

	return (
		<TextField
			label={Tipo === 'J' ? 'CNPJ' : 'CPF'}
			value={value}
			onChange={(e) => onChange(e)}
			name={Tipo === 'J' ? 'CNPJ' : 'CPF'}
			disabled={disabled}
			InputProps={{
				inputComponent: NumberFormatCustom,
			}}
			style={{
				width: Tipo === 'J' ? '150px' : '120px',
			}}
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
			format={TipoCliente === 'J' ? '##.###.###/####-##' : '###.###.###-##'}
			mask='_'
		/>
	);
};

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
