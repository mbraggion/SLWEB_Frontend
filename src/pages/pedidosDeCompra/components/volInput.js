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
			decimalScale={4}
			allowEmptyFormatting={true}
			fixedDecimalScale={true}
			decimalSeparator=','
			thousandSeparator='.'
			onValueChange={(e) => onChange(e)}
			placeholder='Volume'
			suffix=' m³'
			disabled={false}
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default function VolumeInput({ Volume, onChangeVolume }) {
	const classes = useStyles();

	const handleChange = (event) => {
		onChangeVolume(event.floatValue);
	};

	return (
		<TextField
			label='Volume'
			className={classes.TextInput}
			value={Volume}
			variant='outlined'
			onChange={handleChange}
			name='Volume'
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
