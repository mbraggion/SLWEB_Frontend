import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
}));

export default function BasicTextFields(props) {
	const classes = useStyles();

	const handleChange = (event) => {
		props.onChange(event.target.value, event);
	};

	return (
		<form className={classes.root} noValidate autoComplete='off'>
			<TextField
				disabled={props.disabled}
				style={props.style}
				value={props.value}
				type={props.type}
				label={props.label}
				onChange={(e) => handleChange(e)}
			/>
		</form>
	);
}
