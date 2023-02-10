import React, { useState } from 'react';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Typography,
} from '@material-ui/core/';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, Lock as LockIcon } from '@material-ui/icons';

import { useFiles } from '../../../hooks/useFiles';

export const BlockModal = ({ open, onClose }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {
		data: { markedItems, formatedFolderPath },
		actions: { onBlock },
	} = useFiles();

	const [wait, setWait] = useState(false);

	const handleSubmit = async () => {
		setWait(true);

		const res = await onBlock();

		if (res === true) {
			handleClose();
		} else {
			setWait(false);
		}
	};

	const handleClose = () => {
		if (wait) return;
		onClose();

		setWait(false);
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle id='customized-dialog-title' onClose={handleClose}>
				Bloquear{' '}
				{markedItems.length === 1
					? 'arquivo'
					: markedItems.length > 1
					? 'arquivos'
					: 'pasta'}
			</DialogTitle>

			<DialogContent dividers>
				<Typography variant='body1' gutterBottom>
					Você está bloqueando{' '}
					{markedItems.length === 1
						? 'o arquivo'
						: markedItems.length > 1
						? 'os arquivos'
						: 'a pasta'}
					:
				</Typography>
				{markedItems.length > 0 ? (
					markedItems.map((item) => (
						<Typography variant='subtitle1' gutterBottom>
							<strong>{formatedFolderPath}</strong>
						</Typography>
					))
				) : (
					<Typography variant='subtitle1' gutterBottom>
						<strong>\{formatedFolderPath}\</strong>
					</Typography>
				)}
				<Typography variant='caption'>
					*{markedItems.length > 0 ? 'O arquivo' : 'A pasta'} não será mais{' '}
					{markedItems.length > 0 ? 'exibido' : 'exibida'} para franqueados, o
					nivel de acesso {markedItems.length > 0 ? 'do arquivo' : 'da pasta'}{' '}
					poderá futuramente ser controlado pelos administradores do sistema.
				</Typography>
			</DialogContent>

			<DialogActions>
				<Button
					color='primary'
					onClick={handleSubmit}
					startIcon={<LockIcon />}
					disabled={wait}
				>
					Bloquear
				</Button>
				<Button
					color='secondary'
					onClick={handleClose}
					startIcon={<CloseIcon />}
					disabled={wait}
				>
					Fechar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
		minWidth: 500,
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;

	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant='h6'>{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label='close'
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});
