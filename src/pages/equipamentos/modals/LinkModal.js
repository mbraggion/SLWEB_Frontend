import React from 'react';
import Draggable from 'react-draggable';

import {
	Typography,
	makeStyles,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
} from '@material-ui/core';

import { RED_SECONDARY } from '../../../misc/colors';

function ModalPersonalizado(props) {
	const classes = useStyles();

	return (
		<div>
			<Dialog
				open={props.open}
				onClose={props.onClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					{props.title}
				</DialogTitle>

				<DialogContent>
					{props.Clientes.map((cliente) => (
						<div
							key={cliente.CNPJss}
							className={classes.root}
							onClick={() => props.onConfirm(cliente)}
						>
							<Typography variant='h6'>{cliente.Nome_Fantasia}</Typography>
							<Typography style={{ color: RED_SECONDARY }} variant='subtitle1'>
								{cliente.CNPJss}
							</Typography>
						</div>
					))}
				</DialogContent>
				<DialogActions style={{ padding: '8px 24px' }}>
					{props.action}
					<Button onClick={props.onClose} color='primary'>
						Fechar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ModalPersonalizado;

function PaperComponent(props) {
	return (
		<Draggable
			{...props}
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} style={{ maxHeight: '600px' }} />
		</Draggable>
	);
}

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '8px 8px 8px 8px',
		borderRadius: '8px',
		'&:hover': {
			transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			backgroundColor: '#f5f5f5',
			cursor: 'pointer',
		},
	},
}));
