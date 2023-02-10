import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function MultilineTextFields(props) {
	const handleChange = (event) => {
		props.onChange(event);
	};

	return (
		<form noValidate autoComplete='off'>
			<div>
				<TextField
					{...props}
					id='outlined-multiline-flexible'
					label={props.label}
					multiline
					rowsMax={4}
					value={props.value}
					onChange={handleChange}
					variant='outlined'
				/>
			</div>
		</form>
	);
}
