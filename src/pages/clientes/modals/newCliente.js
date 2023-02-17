import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
} from '@material-ui/core/';
import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, Save as SaveIcon } from '@material-ui/icons';

import { Toast } from '../../../components/toasty';
import { InputCNPJ } from '../customComponents/inputCNPJ';
import { InputCEP } from '../customComponents/inputCEP';
import { InputTel } from '../customComponents/inputTel';

export const NewClientModal = ({
	open,
	onClose,
	title,
	onUpdateClientesArray,
}) => {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [newClient, setNewClient] = useState(newClientInitialState);
	const [verificouCNPJ, setVerificouCNPJ] = useState(false);
	const [clienteValido, setClienteValido] = useState(false);
	const [wait, setWait] = useState(false);

	const handleClose = () => {
		onClose();
		resetarGeral();
	};

	useEffect(() => {
		async function valid() {
			if (
				(newClient.CNPJ.length === 14 && newClient.TPessoa === 'J') ||
				(newClient.CNPJ.length === 11 && newClient.TPessoa === 'F')
			) {
				let toastId = null;

				setWait(true);
				toastId = Toast(
					`Validando ${newClient.TPessoa === 'J' ? 'CNPJ' : 'CPF'}...`,
					'wait'
				);

				try {
					const response = await api.get(
						`/client/${newClient.CNPJ}/${newClient.TPessoa}`
					);

					if (response.data.ClienteValido) {
						Toast(
							`${
								newClient.TPessoa === 'J' ? 'CNPJ' : 'CPF'
							} válido para cadastro!`,
							'update',
							toastId,
							'success'
						);
					} else {
						Toast(
							`${
								newClient.TPessoa === 'J' ? 'CNPJ' : 'CPF'
							} inválido para cadastro, contate o suporte para esclarecimento.`,
							'update',
							toastId,
							'error'
						);
					}

					setWait(false);
					setVerificouCNPJ(true);
					setClienteValido(response.data.ClienteValido);

					if (response.data.wsInfo !== null) {
						setNewClient({
							...newClient,
							Nome_Fantasia: response.data.wsInfo.fantasia,
							Razão_Social: response.data.wsInfo.nome,
							Logradouro: response.data.wsInfo.logradouro,
							Número: response.data.wsInfo.numero,
							Complemento: response.data.wsInfo.complemento,
							Bairro: response.data.wsInfo.bairro,
							CEP: String(response.data.wsInfo.cep).replace(/[-,./]/g, ''),
							Município: response.data.wsInfo.municipio,
							UF: response.data.wsInfo.uf,
							Email: response.data.wsInfo.email,
						});
					}
				} catch (err) {
					setWait(false);
					Toast(
						`Falha ao validar ${newClient.TPessoa === 'J' ? 'CNPJ' : 'CPF'}`,
						'update',
						toastId,
						'error'
					);
				}
			}
		}
		valid();
		// eslint-disable-next-line
	}, [newClient.CNPJ, newClient.TPessoa]);

	const resetarGeral = () => {
		setClienteValido(false);
		setVerificouCNPJ(false);
		setNewClient(newClientInitialState);
		setWait(false);
	};

	const handleCadastraCliente = async () => {
		if (!validFields(newClient)) {
			return;
		}
		let toastId = null;

		setWait(true);
		toastId = Toast('Criando Cliente...', 'wait');

		try {
			const response = await api.post('/client/new', {
				cliente: newClient,
			});

			Toast('Cliente adicionado', 'update', toastId, 'success');
			setWait(false);
			handleClose();

			onUpdateClientesArray((oldState) => {
				let aux = [...oldState];
				aux.unshift(response.data.ClienteCadastrado);
				return aux;
			});

			resetarGeral();
		} catch (err) {
			Toast('Falha ao adicionar cliente', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return (
		<Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
			<DialogTitle onClose={handleClose}>{title}</DialogTitle>

			<DialogContent dividers>
				<section
					className={classes.line}
					style={{
						justifyContent: 'space-between',
					}}
				>
					<FormControl className={classes.formControl}>
						<InputLabel>Tipo de Pessoa</InputLabel>
						<Select
							value={newClient.TPessoa}
							disabled={wait}
							onChange={(e) => {
								setNewClient((oldState) => ({
									...newClientInitialState,
									TPessoa: e.target.value,
									CNPJ: '',
								}));
								setClienteValido(false);
								setVerificouCNPJ(false);
							}}
							style={{ width: '120px' }}
						>
							<MenuItem value='J'>Jurídica</MenuItem>
							<MenuItem value='F'>Física</MenuItem>
						</Select>
					</FormControl>
					<InputCNPJ
						value={newClient.CNPJ}
						disabled={wait}
						onChange={(e) => {
							setNewClient((oldState) => ({
								...oldState,
								CNPJ: e.target.value,
							}));
							setClienteValido(false);
							setVerificouCNPJ(false);
						}}
						Tipo={newClient.TPessoa}
					/>
				</section>
				{verificouCNPJ ? (
					clienteValido ? (
						<>
							<section className={classes.line}>
								<TextField
									variant='standard'
									label={
										newClient.TPessoa === 'J'
											? 'Nome Fantasia'
											: 'Nome Completo'
									}
									value={newClient.Nome_Fantasia}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											Nome_Fantasia: e.target.value,
											Razão_Social:
												newClient.TPessoa !== 'J'
													? e.target.value
													: oldState.Razão_Social,
											Contato_Empresa:
												newClient.TPessoa !== 'J'
													? e.target.value.split(' ')[0]
													: oldState.Contato_Empresa,
										}));
									}}
									style={{ width: '100%' }}
								/>
							</section>

							{newClient.TPessoa === 'J' ? (
								<section className={classes.line}>
									<TextField
										variant='standard'
										label='Razão Social'
										multiline
										maxRows={4}
										value={newClient.Razão_Social}
										disabled={wait}
										onChange={(e) => {
											e.persist();
											setNewClient((oldState) => ({
												...oldState,
												Razão_Social: e.target.value,
											}));
										}}
										style={{ width: '100%' }}
									/>
								</section>
							) : null}

							<section
								className={classes.line}
								style={{
									justifyContent: 'space-between',
								}}
							>
								<TextField
									variant='standard'
									label='Inscrição Estadual'
									value={newClient.TPessoa === 'J' ? newClient.IE : 'ISENTO'}
									disabled={!(newClient.TPessoa === 'J') || wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											IE: e.target.value,
										}));
									}}
								/>
							</section>
							<section className={classes.line}>
								<TextField
									variant='standard'
									label='Email'
									value={newClient.Email}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											Email: e.target.value,
										}));
									}}
									style={{ width: '100%' }}
								/>
							</section>
							<section
								className={classes.line}
								style={{
									justifyContent: 'space-between',
								}}
							>
								<div>
									<TextField
										variant='standard'
										label='DDD'
										value={newClient.DDD}
										disabled={wait}
										onChange={(e) => {
											e.persist();
											setNewClient((oldState) => ({
												...oldState,
												DDD: e.target.value,
											}));
										}}
										style={{ width: '40px', marginRight: '8px' }}
									/>
									<InputTel
										value={newClient.Fone}
										onChange={(e) => {
											setNewClient((oldState) => ({
												...oldState,
												Fone: e.target.value,
											}));
										}}
										disabled={wait}
									/>
								</div>
								{newClient.TPessoa === 'J' ? (
									<TextField
										variant='standard'
										label='Contato'
										value={newClient.Contato_Empresa}
										disabled={wait}
										onChange={(e) => {
											e.persist();
											setNewClient((oldState) => ({
												...oldState,
												Contato_Empresa: e.target.value,
											}));
										}}
									/>
								) : null}
							</section>
							<section className={classes.line}>
								<TextField
									variant='standard'
									label='Logradouro'
									value={newClient.Logradouro}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											Logradouro: e.target.value,
										}));
									}}
									multiline
									maxRows={4}
									style={{ width: '100%' }}
								/>
							</section>
							<section
								className={classes.line}
								style={{
									justifyContent: 'space-between',
								}}
							>
								<TextField
									variant='standard'
									label='Bairro'
									value={newClient.Bairro}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											Bairro: e.target.value,
										}));
									}}
									style={{ width: '70%' }}
								/>
								<TextField
									variant='standard'
									label='Número'
									value={newClient.Número}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											Número: e.target.value,
										}));
									}}
									style={{ width: '15%' }}
								/>
							</section>
							<section
								className={classes.line}
								style={{
									justifyContent: 'space-between',
								}}
							>
								<TextField
									variant='standard'
									label='Município'
									value={newClient.Município}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											Município: e.target.value,
										}));
									}}
									style={{ width: '70%' }}
								/>
								<TextField
									variant='standard'
									label='UF'
									value={newClient.UF}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											UF: e.target.value,
										}));
									}}
									style={{ width: '15%' }}
								/>
							</section>
							<section
								className={classes.line}
								style={{
									justifyContent: 'space-between',
								}}
							>
								<InputCEP
									value={newClient.CEP}
									onChange={(e) =>
										setNewClient((oldState) => ({
											...oldState,
											CEP: e.target.value,
										}))
									}
									disabled={wait}
								/>
								<TextField
									variant='standard'
									label='Complemento'
									value={newClient.Complemento}
									disabled={wait}
									onChange={(e) => {
										e.persist();
										setNewClient((oldState) => ({
											...oldState,
											Complemento: e.target.value,
										}));
									}}
								/>
							</section>
						</>
					) : (
						<Typography style={{ textAlign: 'center', marginTop: '16px' }}>
							O {newClient.TPessoa === 'J' ? 'CNPJ' : 'CPF'} fornecido já se
							encontra <strong>cadastrado na filial de outro franqueado</strong>{' '}
							ou <strong>é de um franqueado Pilão Professional</strong>, por
							favor contate o suporte para mais detalhes.
						</Typography>
					)
				) : (
					<Typography style={{ textAlign: 'center', marginTop: '16px' }}>
						Insira {newClient.TPessoa === 'J' ? 'CNPJ' : 'CPF'} completo
					</Typography>
				)}
			</DialogContent>

			<DialogActions>
				<Button
					disabled={wait}
					onClick={resetarGeral}
					color='secondary'
					startIcon={<CloseIcon />}
				>
					Limpar
				</Button>
				<Button
					disabled={wait || !(verificouCNPJ && clienteValido)}
					onClick={handleCadastraCliente}
					color='primary'
					startIcon={<SaveIcon />}
				>
					Salvar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	line: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		flexWrap: 'nowrap',
		minWidth: '400px',
	},
	infoBox: {
		padding: '4px',
		border: '1px solid #ccc',
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

const newClientInitialState = {
	CNPJ: '',
	Nome_Fantasia: '',
	Razão_Social: '',
	IE: '',
	Logradouro: '',
	Número: '',
	Complemento: '',
	Bairro: '',
	CEP: '',
	Município: '',
	UF: '',
	Contato_Empresa: '',
	Email: '',
	DDD: '',
	Fone: '',
	TPessoa: 'J',
};

const validFields = (newCliente) => {
	if (newCliente.CNPJ.trim() === '' || newCliente.CNPJ.length > 14) {
		Toast('Preencha um CNPJ válido', 'warn');
		return false;
	}

	if (
		newCliente.Nome_Fantasia.trim() === '' ||
		newCliente.Nome_Fantasia.length > 255
	) {
		Toast('Preencha um nome fantasia válido', 'warn');
		return false;
	}

	if (
		newCliente.Razão_Social.trim() === '' ||
		newCliente.Razão_Social.length > 255
	) {
		Toast('Preencha uma razão social válida', 'warn');
		return false;
	}

	if (
		newCliente.Logradouro.trim() === '' ||
		newCliente.Logradouro.length > 255
	) {
		Toast('Preencha um logradouro válido', 'warn');
		return false;
	}

	if (newCliente.Número.trim() === '' || newCliente.Número.length > 20) {
		Toast('Preencha um número válido', 'warn');
		return false;
	}

	if (newCliente.Bairro.trim() === '' || newCliente.Bairro.length > 255) {
		Toast('Preencha um bairro válido', 'warn');
		return false;
	}

	if (newCliente.CEP.trim() === '' || newCliente.CEP.length > 9) {
		Toast('Preencha um CEP válido', 'warn');
		return false;
	}

	if (newCliente.Município.trim() === '' || newCliente.Município.length > 255) {
		Toast('Preencha um município válido', 'warn');
		return false;
	}

	if (newCliente.UF.trim() === '' || newCliente.UF.length > 2) {
		Toast('Preencha uma UF válida', 'warn');
		return false;
	}

	if (newCliente.DDD.trim() === '' || newCliente.DDD.length > 3) {
		Toast('Preencha um DDD válido', 'warn');
		return false;
	}

	if (newCliente.Fone.trim() === '' || newCliente.Fone.length > 12) {
		Toast('Preencha um número de celular válido', 'warn');
		return false;
	}

	return true;
};
