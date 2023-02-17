import React, { useState } from 'react';
import { api } from '../../../services/api';

import { withStyles, useTheme } from '@material-ui/core/styles';
import { Close as CloseIcon, Delete as DeleteIcon } from '@material-ui/icons';
import {
	Dialog,
	DialogTitle as MuiDialogTitle,
	DialogContent as MuiDialogContent,
	IconButton,
	Typography,
	useMediaQuery,
	makeStyles,
} from '@material-ui/core';

import { RED_SECONDARY } from '../../../misc/colors';
import { Toast } from '../../../components/toasty';

export const DeleteNewsDialog = ({ open, onClose, News, onHandleNews }) => {
	const theme = useTheme();
	const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const [wait, setWait] = useState(false);

	const handleInactive = async (newId) => {
		setWait(true);
		let toastId = null;
		toastId = Toast('Aguarde...', 'wait');

		try {
			await api.delete(`/dashboard/news/${newId}`);

			Toast('Notícia inativada', 'update', toastId, 'success');
			onHandleNews((oldState) => {
				let aux = [...oldState].filter((n) => n.NewsId !== newId);
				return aux;
			});
			setWait(false);
		} catch (err) {
			Toast('Falha ao inativar notícia', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return (
		<div>
			<Dialog onClose={onClose} fullScreen={fullScreen} open={open}>
				<DialogTitle onClose={onClose}>Inativar Notícia</DialogTitle>
				<DialogContent
					dividers
					style={{
						minWidth: fullScreen ? 'unset' : '550px',
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'flex-start',
							width: '100%',
						}}
					>
						{News.map((n) => (
							<section key={n.NewsId} className={classes.newsLine}>
								<div
									className='XAlign'
									style={{
										width: 'unset',
									}}
								>
									<strong>[{n.NewsId}]</strong> {n.BannerTitle}
								</div>
								<IconButton
									edge='start'
									color='inherit'
									onClick={() => handleInactive(n.NewsId)}
									aria-label='close'
									disabled={wait}
									style={{
										color: RED_SECONDARY,
									}}
								>
									<DeleteIcon fontSize='medium' />
								</IconButton>
							</section>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	newsLine: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'center',
		padding: '8px 16px',
		borderBottom: '1px solid #ccc',
	},
}));

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
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

const DialogContent = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiDialogContent);
