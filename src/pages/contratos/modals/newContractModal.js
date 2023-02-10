import React, { useState } from 'react';
import { api } from '../../../services/api';
import { Icon } from 'react-materialize';
import {
	Close as CloseIcon,
	Save as SaveIcon,
	DeleteForever as DeleteForeverIcon,
} from '@material-ui/icons';
import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import {
	Button,
	MenuItem,
	Select,
	FormControl,
	Dialog,
	InputLabel,
	Divider,
	TextField,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	IconButton,
	Typography,
	useMediaQuery,
} from '@material-ui/core/';

import FileInput from '../../../components/FileInput';
import { InputTel } from '../components/inputTel';
import Datepicker from '../../../components/materialComponents/datePicker';
import { Toast } from '../../../components/toasty';

export const NewContractModal = ({ open, onClose, onRefresh, Clientes }) => {
	const theme = useTheme();
	const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [wait, setWait] = useState(false);
	const [infoContrato, setInfoContrato] = useState(INITIAL_STATE);

	const handleSubmit = async () => {
		if (infoContrato.CNPJ === null || infoContrato.Dt_Inicio === null) {
			return;
		}

		setWait(true);

		const arquivos = getFiles();
		const formData = makeFormData(arquivos);

		let qtdArquivos = formData.getAll('formData').length;

		formData.append('contract', JSON.stringify(infoContrato));
		formData.append('hasFiles', qtdArquivos === 0 ? 'N' : 'S');
		formData.append('multiple', qtdArquivos > 1 ? 'S' : 'N');

		let toastId = null;

		try {
			toastId = Toast('Salvando...', 'wait');

			await api.post(`/contracts`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			Toast('Contrato salvo', 'update', toastId, 'success');
			onRefresh();
			handleClose();
		} catch (err) {
			Toast('Falha ao salvar contrato', 'update', toastId, 'error');
			setWait(false);
		}
	};

	const handleClose = () => {
		if (!wait) {
			onClose();
		}
	};

	const handleSelectFile = () => {
		const arquivos = getFiles();
		const formData = makeFormData(arquivos);

		let fn = [];

		for (let i = 0; i < formData.getAll('formData').length; i++) {
			fn.push(formData.getAll('formData')[i].name);
		}

		setInfoContrato({ ...infoContrato, documents: fn });
	};

	const getFiles = () => {
		//Pega todos inputs do tipo arquivos
		const arquivos = document.getElementsByClassName('files');

		return arquivos;
	};

	const makeFormData = (htmlFileCollection) => {
		//cria um objeto do tipo formulario
		const formData = new FormData();

		//poe o conteudo de todos os inputs do tipo arquivo dentro do mesmo formulario
		for (let j = 0; j < htmlFileCollection.length; j++) {
			for (let i = 0; i < htmlFileCollection[j].files.length; i++) {
				formData.append(`formData`, htmlFileCollection[j].files[i]);
			}
		}

		return formData;
	};

	const handleClear = () => {
		setInfoContrato(INITIAL_STATE);
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			maxWidth={false}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle onClose={handleClose}>Novo Contrato</DialogTitle>

			<DialogContent dividers>
				<div className={classes.container}>
					<div className={classes.linha}>
						<FormControl variant='outlined' className={classes.formControl}>
							<InputLabel id='demo-simple-select-outlined-label'>
								Cliente
							</InputLabel>
							<Select
								labelId='demo-simple-select-outlined-label'
								id='demo-simple-select-outlined'
								value={infoContrato.CNPJ}
								onChange={(e) =>
									setInfoContrato({
										...infoContrato,
										CNPJ: e.target.value,
									})
								}
								label='Cliente'
								disabled={wait}
							>
								<MenuItem value={null} disabled>
									{' '}
									Selecione...{' '}
								</MenuItem>
								{Clientes.map((c) => (
									<MenuItem value={c.CNPJ}>{c.Nome_Fantasia}</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className={classes.linha}>
						<Datepicker
							focus={false}
							min={false}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Dt_Inicio: e._d,
								})
							}
							disabled={wait}
							label={'Início'}
							defaultValue={infoContrato.Dt_Inicio}
							style={{ marginRight: '4px' }}
						/>
						<Datepicker
							focus={false}
							min={false}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Dt_Fim: e._d,
								})
							}
							disabled={wait}
							label={'Encerramento'}
							defaultValue={infoContrato.Dt_Fim}
							style={{ marginLeft: '4px' }}
						/>
					</div>

					<Divider style={{ width: '100%', margin: '8px 0px' }} />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography color='primary' display='block' variant='body1'>
							Contato 1
						</Typography>
					</li>

					<div className={classes.linha}>
						<TextField
							value={infoContrato.Contato_Empresa}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Contato_Empresa: e.target.value,
								})
							}
							disabled={wait}
							label='Nome'
						/>
						<InputTel
							value={infoContrato.Contato2}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Contato2: e.target.value,
								})
							}
							disabled={wait}
							className={classes.telInput}
							label={'Telefone'}
						/>
					</div>
					<div className={classes.linha}>
						<TextField
							value={infoContrato.Email}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Email: e.target.value,
								})
							}
							disabled={wait}
							label='Email'
							className={classes.email}
						/>
					</div>

					<Divider style={{ width: '100%', margin: '8px 0px' }} />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography color='primary' display='block' variant='body1'>
							Contato 2
						</Typography>
					</li>

					<div className={classes.linha}>
						<TextField
							value={infoContrato.Contato_Empresa_2}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Contato_Empresa_2: e.target.value,
								})
							}
							disabled={wait}
							label='Nome'
						/>
						<InputTel
							value={infoContrato.Fone_2}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Fone_2: e.target.value,
								})
							}
							disabled={wait}
							className={classes.telInput}
							label={'Telefone'}
						/>
					</div>
					<div className={classes.linha}>
						<TextField
							value={infoContrato.Email_2}
							onChange={(e) =>
								setInfoContrato({
									...infoContrato,
									Email_2: e.target.value,
								})
							}
							disabled={wait}
							label='Email'
							className={classes.email}
						/>
					</div>

					<Divider style={{ width: '100%', margin: '8px 0px' }} />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography color='primary' display='block' variant='body1'>
							Documentos
						</Typography>
					</li>

					<ul
						style={{
							listStyleType: 'disclosure-closed',
							paddingLeft: '16px',
							maxWidth: '400px',
						}}
					>
						{infoContrato.documents.map((filename) => (
							<li
								style={{
									listStyleType: 'disclosure-closed',
								}}
							>
								<Typography variant='body1' className={classes.documentsLink}>
									{filename}
								</Typography>
							</li>
						))}
					</ul>

					<FileInput
						label={
							<div className='XAlign'>
								<Icon>attach_file</Icon>
								ENVIAR DOCUMENTO
							</div>
						}
						ContainerStyle={{
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							width: '100%',
						}}
						ButtonStyle={{
							width: '100%',
						}}
						onChange={handleSelectFile}
						name='upload'
						accept='application/pdf,image/png, image/jpeg'
						multiple={true}
						disabled={wait}
					/>
				</div>
			</DialogContent>

			<DialogActions>
				<Button
					disabled={wait}
					onClick={handleClear}
					color='secondary'
					startIcon={<DeleteForeverIcon />}
				>
					Limpar campos
				</Button>
				<Button
					disabled={wait}
					onClick={handleSubmit}
					color='primary'
					startIcon={<SaveIcon />}
				>
					Salvar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const INITIAL_STATE = {
	CNPJ: null,

	Dt_Inicio: null,
	Dt_Fim: null,

	Contato_Empresa: '',
	Contato2: null,
	Email: '',

	Contato_Empresa_2: '',
	Fone_2: null,
	Email_2: '',
	documents: [],
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	formControl: {
		width: '100%',
		margin: '8px 0px 0px 0px',
	},
	conId: {
		maxWidth: '50px',
	},
	cliente: {
		width: '100%',
		marginLeft: '8px',
	},
	linha: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	CNPJ: {
		width: '100%',
		marginTop: '8px',
	},
	email: {
		width: '100%',
	},
	dividerInset: {
		margin: `5px 0 0 ${theme.spacing(9)}px`,
	},
	documentsLink: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		fontSize: '16px',
		padding: '4px 0px',

		'&:hover': {
			textDecoration: 'underline',
			color: 'blue',
			cursor: 'pointer',
		},
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
	formControl: {
		minWidth: 120,
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
