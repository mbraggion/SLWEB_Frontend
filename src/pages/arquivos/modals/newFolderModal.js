import React, { useState } from 'react';

import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Typography,
} from '@material-ui/core/';
import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import {
	Close as CloseIcon,
	CreateNewFolder as CreateNewFolderIcon,
} from '@material-ui/icons';

import { useFiles } from '../../../hooks/useFiles';

export const NewFolderModal = ({ open, onClose }) => {
	const theme = useTheme();
	const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {
		data: { formatedFolderPath },
		actions: { onCreateFolder },
	} = useFiles();

	const [wait, setWait] = useState(false);
	const [newFolderName, setNewFolderName] = useState('');

	const handleSubmit = async () => {
		setWait(true);

		const res = await onCreateFolder(newFolderName);

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
		setNewFolderName('');
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle id='customized-dialog-title' onClose={handleClose}>
				Criar nova pasta no diretório
			</DialogTitle>

			<DialogContent dividers>
				<div className='YAlign'>
					<TextField
						className={classes.TextInput}
						label='Nome da pasta'
						variant='outlined'
						value={newFolderName}
						onChange={(e) => setNewFolderName(e.target.value)}
						disabled={wait}
					/>
					<Typography variant='caption'>
						Caminho:{' '}
						<strong>
							\{formatedFolderPath}\{newFolderName}
						</strong>
					</Typography>
				</div>
			</DialogContent>

			<DialogActions>
				<Button
					color='primary'
					onClick={handleSubmit}
					startIcon={<CreateNewFolderIcon />}
					disabled={wait}
				>
					Criar
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

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		width: '100%',
		height: '54px',
	},
	TextInput: {
		height: '55px',
		width: '100%',
		'& div': {
			height: '100%',
		},
		'& div>input:nth-child(1)': {
			margin: '0px 8px',
		},
	},
}));

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
