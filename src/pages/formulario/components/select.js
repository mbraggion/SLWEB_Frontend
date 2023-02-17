import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
	formControl: {
		width: '100%',
	},
}));

export default function OutlinedSelect({
	onChange,
	label,
	value,
	disabled = false,
	...props
}) {
	const classes = useStyles();
	const [variable, setVariable] = useState('');

	const handleChange = (event) => {
		setVariable(event.target.value);
		onChange(event);
	};

	useEffect(() => {
		setVariable(value !== null && typeof value != 'undefined' ? value : '');
	}, [value]);

	return (
		<div>
			<FormControl
				variant='outlined'
				className={classes.formControl}
				disabled={disabled}
			>
				<InputLabel id='demo-simple-select-outlined-label'>{label}</InputLabel>
				<Select
					labelId='demo-simple-select-outlined-label'
					id='demo-simple-select-outlined'
					value={variable}
					onChange={handleChange}
					label={label}
				>
					<MenuItem value='' disabled>
						<em>Selecione...</em>
					</MenuItem>
					{props.children}
				</Select>
			</FormControl>
		</div>
	);
}
