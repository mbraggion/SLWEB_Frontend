import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

let Decimais = 0;

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			style={{ paddingLeft: '8px' }}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			decimalScale={Decimais}
			thousandSeparator='.'
			decimalSeparator=','
			fixedDecimalScale={true}
			isNumericString
			prefix=''
			allowNegative={false}
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

function InputAdornments(props) {
	const classes = useStyles();
	const [values, setValues] = React.useState({
		numberformat: '1320',
	});

	useEffect(() => {
		Decimais = props.decimais;
	}, [props.decimais]);

	const handleChange = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});

		props.onChange(event);
	};

	return (
		<div style={props.style} className={classes.root}>
			<TextField
				name='numberformat'
				id='formatted-numberformat-input'
				label={props.label}
				disabled={props.disabled}
				className={clsx(classes.margin, classes.textField)}
				onChange={handleChange}
				InputProps={{
					inputComponent: NumberFormatCustom,
				}}
				variant='outlined'
				value={
					typeof props.value != 'undefined' && props.value !== null
						? props.value
						: ''
				}
			/>
		</div>
	);
}

export default InputAdornments;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	margin: {
		margin: '0px',
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: '100%',
		'& #outlined-start-adornment': {
			border: 'none',
			borderBottom: 'none',
		},
		'& #outlined-start-adornment:focus': {
			border: 'none  ',
			borderBottom: 'none  ',
		},
	},
}));
