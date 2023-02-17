import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
	return (
		<Draggable
			{...props}
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

export default function DraggableDialog(props) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
		props.onOpen && props.onOpen();
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (typeof props.shouldClose != 'undefined') {
			setOpen(!props.shouldClose);
		}
	}, [props.shouldClose]);

	return (
		<div>
			<Button
				disabled={props.disabled}
				startIcon={props.icone}
				style={{
					height: '54px',
					...props.buttonStyle,
				}}
				variant='outlined'
				color='primary'
				onClick={handleClickOpen}
			>
				{props.botao}
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					{props.title}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>{props.children}</DialogContentText>
				</DialogContent>
				<DialogActions style={{ padding: '8px 24px' }}>
					{props.action}
					<Button onClick={handleClose} color='primary'>
						Fechar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
