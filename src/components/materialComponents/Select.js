import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

export default function SimpleSelect({
	onChange,
	value,
	condicao,
	label,
	disabled,
	width,
	MLeft,
	MTop,
	MRight,
	MBottom,
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
				style={{
					minWidth: width ? width : '120px',
					marginLeft: MLeft ? MLeft : '0px',
					marginTop: MTop ? MTop : '0px',
					marginRight: MRight ? MRight : '0px',
					marginBottom: MBottom ? MBottom : '0px',
				}}
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
					<MenuItem value=''>
						<em>Nenhuma</em>
					</MenuItem>
					{props.children}
				</Select>
				{condicao && disabled ? (
					<FormHelperText>{condicao}</FormHelperText>
				) : (
					''
				)}
			</FormControl>
		</div>
	);
}
