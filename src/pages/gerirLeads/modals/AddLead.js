import React, { useState } from 'react';
import { api } from '../../../services/api';

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Button,
	Typography,
	TextField,
	MenuItem,
} from '@material-ui/core/';

import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';

import { Close as CloseIcon, Add as AddIcon } from '@material-ui/icons';

import { Toast } from '../../../components/toasty';
import InputMultline from '../../../components/materialComponents/InputMultline';
import Select from '../../../components/materialComponents/Select';

export const AddLead = ({ open, onClose }) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const classes = useStyles();

	const [NomeFantasia, setNomeFantasia] = useState('');
	const [RazaoSocial, setRazaoSocial] = useState('');
	const [Estado, setEstado] = useState('');
	const [Municipio, setMunicipio] = useState('');
	const [Contato, setContato] = useState('');
	const [Fone1, setFone1] = useState('');
	const [Fone2, setFone2] = useState('');
	const [Email, setEmail] = useState('');
	const [Desc, setDesc] = useState('');
	const [Msg, setMsg] = useState('');
	const [wait, setWait] = useState(false);

	const handleSubmit = async () => {
		let toastId = null;

		const loadDTO = {
			NomeFantasia,
			RazaoSocial,
			Estado,
			Municipio,
			Contato,
			Fone1,
			Fone2,
			Email,
			Desc,
			Msg,
		};

		toastId = Toast('Aguarde...', 'wait');
		setWait(true);

		try {
			await api.post('/leads', {
				lead: loadDTO,
			});

			Toast('Lead Cadastrado!', 'update', toastId, 'success');
			resetField();
			setWait(false);
		} catch (err) {
			Toast('Falha ao cadastrar lead', 'update', toastId, 'error');
			setWait(false);
		}
	};

	const resetField = () => {
		setNomeFantasia('');
		setRazaoSocial('');
		setEstado('');
		setMunicipio('');
		setContato('');
		setFone1('');
		setFone2('');
		setEmail('');
		setDesc('');
		setMsg('');
	};

	const handleClose = () => {
		if (wait) {
			return;
		} else {
			onClose();
			setWait(false);
		}
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle id='customized-dialog-title' onClose={handleClose}>
				Adicionar Lead
			</DialogTitle>

			<DialogContent dividers>
				<div
					className='XAlign'
					style={{
						width: '100%',
						justifyContent: 'space-between',
						flexWrap: 'nowrap',
					}}
				>
					<TextField
						className={classes.TextInput}
						style={{ margin: '0px 0px 8px 0px' }}
						value={NomeFantasia}
						id='outlined-basic'
						label='Nome Fantasia'
						variant='outlined'
						onChange={(e) => setNomeFantasia(e.target.value)}
					/>
					<TextField
						className={classes.TextInput}
						style={{ margin: '0px 0px 8px 0px' }}
						value={RazaoSocial}
						id='outlined-basic'
						label='Razão Social'
						variant='outlined'
						onChange={(e) => setRazaoSocial(e.target.value)}
					/>
				</div>
				<Select
					width='100%'
					MBottom='8px'
					label='Estado'
					value={Estado}
					onChange={(e) => setEstado(e.target.value)}
				>
					{estados.map((estado) => (
						<MenuItem value={estado.UF}>{estado.estado}</MenuItem>
					))}
				</Select>

				<div
					className='XAlign'
					style={{
						width: '100%',
						justifyContent: 'space-between',
						flexWrap: 'nowrap',
					}}
				>
					<TextField
						className={classes.TextInput}
						style={{ margin: '0px 16px 0px 0px' }}
						value={Municipio}
						id='outlined-basic'
						label='Município'
						variant='outlined'
						onChange={(e) => setMunicipio(e.target.value)}
					/>
					<TextField
						className={classes.TextInput}
						style={{ margin: '8px 0px 8px 0px' }}
						value={Contato}
						id='outlined-basic'
						label='Contato'
						variant='outlined'
						onChange={(e) => setContato(e.target.value)}
					/>
				</div>
				<div
					className='XAlign'
					style={{
						width: '100%',
						justifyContent: 'space-between',
						flexWrap: 'nowrap',
					}}
				>
					<TextField
						className={classes.TextInput}
						style={{ margin: '0px 16px 0px 0px' }}
						value={Fone1}
						id='outlined-basic'
						label='Fone 1'
						variant='outlined'
						onChange={(e) => setFone1(e.target.value)}
					/>
					<TextField
						className={classes.TextInput}
						style={{ margin: '8px 0px 8px 0px' }}
						value={Fone2}
						id='outlined-basic'
						label='Fone 2'
						variant='outlined'
						onChange={(e) => setFone2(e.target.value)}
					/>
				</div>
				<TextField
					className={classes.TextInput}
					style={{ width: '100%' }}
					value={Email}
					id='outlined-basic'
					label='Email'
					variant='outlined'
					onChange={(e) => setEmail(e.target.value)}
				/>
				<InputMultline
					style={{
						width: '100%',
						marginTop: '8px',
						backgroundColor:
							charCount(Desc, 250) < 0 ? 'rgb(255, 0, 0, 0.5)' : 'inherit',
					}}
					value={Desc}
					onChange={(e) => setDesc(e.target.value)}
					label={`Atividade/Descrição(${charCount(Desc, 250)})`}
				/>
				<InputMultline
					style={{
						width: '100%',
						marginTop: '8px',
						backgroundColor:
							charCount(Msg, 250) < 0 ? 'rgb(255, 0, 0, 0.5)' : 'inherit',
					}}
					value={Msg}
					onChange={(e) => setMsg(e.target.value)}
					label={`Recado Lead (${charCount(Msg, 250)})`}
				/>
			</DialogContent>

			<DialogActions>
				<Button
					onClick={() => handleSubmit()}
					startIcon={<AddIcon />}
					variant='contained'
					color='primary'
					disabled={wait}
				>
					Cadastrar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	TextInput: {
		'& div>input:nth-child(1)': {
			marginLeft: '8px',
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

const charCount = (field, maxChar) => {
	return maxChar - field.length;
};

const estados = [
	{ estado: 'Acre', UF: 'AC' },
	{ estado: 'Alagoas', UF: 'AL' },
	{ estado: 'Amapá', UF: 'AP' },
	{ estado: 'Amazonas', UF: 'AM' },
	{ estado: 'Bahia', UF: 'BA' },
	{ estado: 'Ceará', UF: 'CE' },
	{ estado: 'Distrito Federal', UF: 'DF' },
	{ estado: 'Espírito Santo', UF: 'ES' },
	{ estado: 'Goiás', UF: 'GO' },
	{ estado: 'Maranhão', UF: 'MA' },
	{ estado: 'Mato Grosso', UF: 'MT' },
	{ estado: 'Mato Grosso do Sul', UF: 'MS' },
	{ estado: 'Minas Gerais', UF: 'MG' },
	{ estado: 'Pará', UF: 'PA' },
	{ estado: 'Paraíba', UF: 'PB' },
	{ estado: 'Paraná', UF: 'PR' },
	{ estado: 'Pernambuco', UF: 'PE' },
	{ estado: 'Piauí', UF: 'PI' },
	{ estado: 'Rio de Janeiro', UF: 'RJ' },
	{ estado: 'Rio Grande do Norte', UF: 'RN' },
	{ estado: 'Rio Grande do Sul', UF: 'RS' },
	{ estado: 'Rondônia', UF: 'RO' },
	{ estado: 'Roraima', UF: 'RR' },
	{ estado: 'Santa Catarina', UF: 'SC' },
	{ estado: 'São Paulo', UF: 'SP' },
	{ estado: 'Sergipe', UF: 'SE' },
	{ estado: 'Tocantins', UF: 'TO' },
];
