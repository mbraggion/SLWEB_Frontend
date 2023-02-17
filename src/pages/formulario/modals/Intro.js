import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

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

const Content = () => {
	const [open, setOpen] = React.useState(true);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby='customized-dialog-title'
			open={open}
		>
			<DialogTitle id='customized-dialog-title' onClose={handleClose}>
				Aviso
			</DialogTitle>
			<DialogContent dividers>
				<div className='YAlign'>
					<Typography
						variant='h6'
						gutterBottom
						style={{ textAlign: 'center', marginBottom: '16px' }}
					>
						Agradecemos o preenchimento do questionário e ressaltamos que as
						informações serão tratadas com a devida discrição.
					</Typography>

					<Typography
						variant='body1'
						gutterBottom
						style={{ textAlign: 'center', fontWeight: '500' }}
					>
						Trata-se de um questionário abrangente. A coleta de todas as
						informações tem como objetivo avaliar se o que temos para oferecer
						está dentro da expectativa e vice-versa, visando com isso promover o
						sucesso do empreendimento. Estamos também à disposição caso se
						deseje qualquer informação sobre a Pilão Professional ou sobre o
						nosso sistema de franquia.
					</Typography>

					<Typography
						variant='subtitle1'
						gutterBottom
						style={{ textAlign: 'center', fontWeight: '500' }}
					>
						Caso exista mais de uma pessoa na condução do negócio, que irá
						participar do dia a dia da operação, participando ou não formalmente
						no contrato social, é imprescindível que seja enviado um
						questionário para cada pessoa envolvida.
					</Typography>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='primary'>
					Fechar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Content;
