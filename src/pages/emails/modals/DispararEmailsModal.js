import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';

import { withStyles, useTheme, makeStyles } from '@material-ui/core/styles';
import {
	Close as CloseIcon,
	Add as AddIcon,
	PlaylistAddCheck as PlaylistAddCheckIcon,
	ClearAll as ClearAllIcon,
} from '@material-ui/icons';
import {
	Button,
	Dialog,
	DialogTitle as MuiDialogTitle,
	DialogContent as MuiDialogContent,
	DialogActions as MuiDialogActions,
	IconButton,
	Typography,
	useMediaQuery,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Checkbox,
	FormControlLabel,
} from '@material-ui/core';

import PainelComAbas from '../../../components/materialComponents/PainelAbas';
import { Toast } from '../../../components/toasty';

export const DispatchEmailsModal = ({ open, onClose }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const classes = useStyles({
		fullScreen,
	});

	const [mailAdressess, setMailAdressess] = useState([]);
	const [mailTemplates, setMailTemplates] = useState([]);
	const [wait, setWait] = useState(false);
	const [mailData, setMailData] = useState(INITIAL_MAIL_DATA);
	const [customEmail, setCustomEmail] = useState({
		Email: '',
		id: 1,
	});

	useEffect(() => {
		async function loadData() {
			try {
				const response = await api.get('/emails/dispatch/');

				setMailAdressess(response.data.AvailableRecipients);
				setMailTemplates(response.data.Templates);
			} catch (err) {}
		}
		if (open === true) {
			loadData();
		}
	}, [open]);

	const handleCloseModal = () => {
		onClose();
		setMailData(INITIAL_MAIL_DATA);
		setWait(false);
		setCustomEmail({ Email: '', id: 1 });
		setMailTemplates([]);
		setMailAdressess([]);
	};

	const handleDisparaEmails = async () => {
		//verificar se tem assunto
		if (mailData.subject.trim() === '') {
			Toast('Defina um assunto para o email', 'warn');
			return;
		}

		//verificar se tem corpo
		if (mailData.body.trim() === '') {
			Toast('Defina uma mensagem para o email', 'warn');
			return;
		}

		//verificar se definiu um nome pro modelo novo
		if (
			mailData.salvarNovoTemplate === true &&
			mailData.template === null &&
			mailData.nomeNovoTemplate.trim() === ''
		) {
			Toast('Defina um nome para o novo modelo', 'warn');
			return;
		}

		//verificar se tem distinatário
		if (mailData.recipients.length === 0) {
			Toast('Nenhum destinatário selecionado', 'warn');
			return;
		}

		const confirmou = window.confirm('Deseja realmente disparar os emails?');

		if (confirmou) {
			let toastId = null;

			toastId = Toast('Enviando emails...', 'wait');
			setWait(true);

			try {
				await api.post('/emails/dispatch/', {
					...mailData,
				});
				Toast('Emails enviados', 'update', toastId, 'success');
				setWait(false);
				setMailData(INITIAL_MAIL_DATA);
			} catch (err) {
				Toast('Falha enviar emails', 'update', toastId, 'error');
				setWait(false);
			}
		}
	};

	const handleSelectTemplate = (value) => {
		if (value === null) {
			setMailData({
				...mailData,
				template: null,
				subject: '',
				body: '',
				nomeNovoTemplate: '',
				salvarNovoTemplate: false,
			});
			return;
		}

		const templateTarget = mailTemplates.filter(
			(temp) => temp.ModeloID === value
		)[0];

		setMailData({
			...mailData,
			template: value,
			subject: templateTarget.ModeloNome,
			body: templateTarget.rawHTML,
			nomeNovoTemplate: templateTarget.ModeloArquivoEdgeNome,
			salvarNovoTemplate: false,
		});
	};

	const handleMarkRecipient = (value) => {
		setMailData((oldState) => {
			let index = null;

			oldState.recipients.forEach((recipient, i) => {
				if (recipient.M0_CODFIL === value.M0_CODFIL) {
					index = i;
				}
			});

			if (index === null) {
				return {
					...oldState,
					recipients: [...oldState.recipients, value],
				};
			} else {
				return {
					...oldState,
					recipients: [...oldState.recipients].filter(
						(recipient) => recipient.M0_CODFIL !== value.M0_CODFIL
					),
				};
			}
		});
	};

	const handleAddCustomEmail = () => {
		if (customEmail.Email === '') {
			Toast('Preencha um email', 'warn');
			return;
		}

		const newCustomRecipientToDisplay = {
			A1_GRPVEN: String(customEmail.id).padStart(6, 'X'),
			M0_CODFIL: String(customEmail.id).padStart(4, 'X'),
			Email: customEmail.Email,
		};

		//add na lista geral
		setMailAdressess((oldState) => {
			let aux = [...oldState];
			aux.unshift(newCustomRecipientToDisplay);

			return aux;
		});

		//add na lista de recipients
		handleMarkRecipient(newCustomRecipientToDisplay);

		setCustomEmail((oldState) => ({
			Email: '',
			id: oldState.id + 1,
		}));
	};

	const handleMarkUnmarkAll = () => {
		if (mailData.recipients.length === mailAdressess.length) {
			//se já tiver geral preenchido, despreencher geral
			setMailData((oldState) => {
				return {
					...oldState,
					recipients: [],
				};
			});
		} else {
			//se não tiver preenchido, preencher geral
			setMailData((oldState) => {
				return {
					...oldState,
					recipients: mailAdressess,
				};
			});
		}
	};

	return (
		<div>
			<Dialog onClose={handleCloseModal} fullScreen={fullScreen} open={open}>
				<DialogTitle onClose={handleCloseModal}>
					Envio em massa de emails
				</DialogTitle>
				<DialogContent dividers>
					<PainelComAbas titles={['Email', 'Destinatários']}>
						<div
							className='YAlign'
							style={{
								width: fullScreen ? '100%' : '400px',
							}}
						>
							<FormControl variant='filled' className={classes.formControl}>
								<InputLabel>Modelos salvos</InputLabel>
								<Select
									className={classes.Select}
									value={mailData.template}
									onChange={(e) => handleSelectTemplate(e.target.value)}
								>
									<MenuItem value={null}>Selecione...</MenuItem>
									{mailTemplates.map((template) => (
										<MenuItem key={template.ModeloID} value={template.ModeloID}>
											{template.ModeloNome}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								className={classes.SubjectInput}
								label='Assunto'
								variant='outlined'
								onChange={(e) =>
									setMailData({
										...mailData,
										subject: e.target.value,
									})
								}
								value={mailData.subject}
							/>
							<TextField
								className={classes.BodyInput}
								label='Corpo do Email'
								variant='outlined'
								multiline
								rows={8}
								value={mailData.body}
								onChange={(e) =>
									setMailData({
										...mailData,
										body: e.target.value,
									})
								}
							/>
							<div
								className='XAlign'
								style={{
									justifyContent: 'space-between',
									margin: '8px 0px 0px 0px',
								}}
							>
								<FormControlLabel
									control={
										<Checkbox
											className={classes.checkbox}
											checked={mailData.salvarNovoTemplate}
											onChange={(e) =>
												setMailData({
													...mailData,
													salvarNovoTemplate: e.target.checked,
												})
											}
											name='salvarNovoTemplate'
										/>
									}
									label={
										mailData.template === null
											? 'Salvar Modelo'
											: 'Atualizar modelo'
									}
								/>

								{mailData.template === null &&
								mailData.salvarNovoTemplate === true ? (
									<TextField
										className={classes.NewModelInput}
										label='Nome do novo modelo'
										variant='outlined'
										onChange={(e) =>
											setMailData({
												...mailData,
												nomeNovoTemplate: e.target.value,
											})
										}
										value={mailData.nomeNovoTemplate}
									/>
								) : null}
							</div>
						</div>
						<div className='YAlign'>
							<div
								className='XAlign'
								style={{
									borderBottom: '1px dashed #ccc',
									padding: '0px 0px 8px 0px',
								}}
							>
								<TextField
									className={classes.InputWithButton}
									label='Inserir email extra'
									variant='outlined'
									value={customEmail.Email}
									onChange={(e) =>
										setCustomEmail({
											...customEmail,
											Email: e.target.value,
										})
									}
								/>
								<IconButton
									className={classes.closeButton}
									onClick={handleAddCustomEmail}
								>
									<AddIcon fontSize='medium' />
								</IconButton>
							</div>
							<List dense className={classes.root}>
								{mailAdressess.map((recipient) => (
									<ListItem
										key={recipient.M0_CODFIL}
										button
										onClick={() => handleMarkRecipient(recipient)}
									>
										<ListItemText
											primary={`Filial ${recipient.M0_CODFIL}`}
											secondary={recipient.Email}
										/>
										<ListItemSecondaryAction>
											<Checkbox
												edge='end'
												className={classes.checkbox}
												onChange={() => handleMarkRecipient(recipient)}
												checked={
													mailData.recipients.filter(
														(recip) => recip.M0_CODFIL === recipient.M0_CODFIL
													).length > 0
												}
												inputProps={{
													'aria-labelledby': `checkbox-list-secondary-label-${recipient.M0_CODFIL}`,
												}}
											/>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
							<Button
								onClick={handleMarkUnmarkAll}
								color='primary'
								disabled={wait}
								variant='outlined'
								startIcon={
									mailData.recipients.length === mailAdressess.length ? (
										<ClearAllIcon />
									) : (
										<PlaylistAddCheckIcon />
									)
								}
								style={{
									width: '100%',
									margin: '8px 0px 0px 0px',
								}}
							>
								{mailData.recipients.length === mailAdressess.length
									? `Desmarcar todos (${mailData.recipients.length})`
									: `Marcar todos (${mailAdressess.length})`}
							</Button>
						</div>
					</PainelComAbas>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDisparaEmails} color='primary' disabled={wait}>
						Confirmar e Enviar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

const INITIAL_MAIL_DATA = {
	template: null,
	subject: '',
	body: '',
	recipients: [],
	salvarNovoTemplate: false,
	nomeNovoTemplate: '',
};

const useStyles = makeStyles((theme) => ({
	SubjectInput: {
		margin: '0px 0px 8px 0px',
		width: '100%',
		'&:nth-child(2) > div > input': {
			marginLeft: '8px',
		},
	},
	NewModelInput: {
		width: 'calc(100% - 150px)',
		'&:nth-child(2) > div > input': {
			marginLeft: '8px',
		},
	},
	InputWithButton: {
		width: 'calc(100% - 54.5px)',
		margin: '0px 8px 0px 0px',
		'&:nth-child(1) > div > input': {
			marginLeft: '8px',
		},
	},
	BodyInput: {
		width: '100%',
	},
	formControl: {
		margin: '0px 0px 8px 0px',
		minWidth: 120,
		width: '100%',
	},
	Select: {
		width: '100%',
	},
	root: (props) => ({
		width: '100%',
		maxWidth: props.fullScreen ? '100%' : '500px',
		backgroundColor: theme.palette.background.paper,
		overflowX: 'hidden',
		overflowY: 'auto',
		maxHeight: '400px',
		margin: '8px 0px 0px 0px',
	}),
	checkbox: {
		transform: 'scale(0.3)',
	},
}));

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
		minWidth: '300px',
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
		padding: '0px',
	},
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1),
	},
}))(MuiDialogActions);
