import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
		},
	},
}));

function NumberFormatCustom(props) {
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
			prefix='$'
			format='(##) # ####-####'
			mask='_'
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default function FormattedInputs(props) {
	const classes = useStyles();
	const [values, setValues] = React.useState({
		numberformat: '',
	});

	const handleChange = (event) => {
		props.onChange(event);
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});
	};

	return (
		<div className={classes.root}>
			<TextField
				style={props.style}
				label={props.label}
				value={
					typeof props.value != 'undefined' && props.value !== null
						? props.value
						: ''
				}
				onChange={handleChange}
				name='numberformat'
				id='formatted-numberformat-input'
				InputProps={{
					inputComponent: NumberFormatCustom,
				}}
			/>
		</div>
	);
}
