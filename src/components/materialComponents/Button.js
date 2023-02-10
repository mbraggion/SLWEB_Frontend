import React from 'react';
import Button from '@material-ui/core/Button';

export default function IconLabelButtons(props) {
	return (
		<Button
			{...props}
			variant='contained'
			color='default'
			size='large'
			startIcon={props.icon}
			className={props.className}
			href={props.href}
			disabled={props.disabled}
			onClick={props.onClick}
		>
			{props.children}
		</Button>
	);
}
