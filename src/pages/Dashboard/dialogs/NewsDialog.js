import React from 'react';

import { withStyles, useTheme } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import {
	Button,
	Dialog,
	DialogTitle as MuiDialogTitle,
	DialogContent as MuiDialogContent,
	DialogActions as MuiDialogActions,
	IconButton,
	Typography,
	useMediaQuery,
} from '@material-ui/core';

export const NewsDetailsDialog = ({ open, onClose, title, content }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<div>
			<Dialog onClose={onClose} fullScreen={fullScreen} open={open}>
				<DialogTitle onClose={onClose}>{title}</DialogTitle>

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
							fontSize: '14px',
						}}
						dangerouslySetInnerHTML={{ __html: content }}
					></div>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color='primary'>
						Ciente!
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

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

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
	},
}))(MuiDialogActions);
