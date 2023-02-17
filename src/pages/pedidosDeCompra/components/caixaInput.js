import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			allowLeadingZeros={true}
			allowNegative={false}
			decimalScale={0}
			allowEmptyFormatting={false}
			fixedDecimalScale={true}
			decimalSeparator=','
			thousandSeparator='.'
			onValueChange={(e) => onChange(e)}
			placeholder='Caixas'
			suffix=' Un'
			disabled={false}
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default function CaixaInput({ Qtd, onChangeQtd, disabled }) {
	const classes = useStyles();

	const handleChange = (event) => {
		onChangeQtd(event.floatValue);
	};

	return (
		<TextField
			label='Unidades'
			className={classes.TextInput}
			value={Qtd}
			disabled={disabled}
			variant='standard'
			onChange={handleChange}
			name='Unidades'
			InputProps={{
				inputComponent: NumberFormatCustom,
			}}
		/>
	);
}

const useStyles = makeStyles((theme) => ({
	TextInput: {
		width: '100px',
		margin: '8px 0px',
		'& div>input:nth-child(1)': {
			marginLeft: '8px',
		},
	},
}));
