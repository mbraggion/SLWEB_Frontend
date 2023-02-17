import React, { useState } from 'react';
import { api } from '../../../services/api';

import {
	Button,
	Dialog,
	Slider,
	Divider,
	TextField,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	FormControlLabel,
	IconButton,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
} from '@material-ui/core/';
import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import {
	Close as CloseIcon,
	InsertDriveFile as InsertDriveFileIcon,
	InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
	DeleteForever as DeleteForeverIcon,
	Save as SaveIcon,
} from '@material-ui/icons';

import { InputCNPJ } from '../components/inputCNPJ';
import { InputCEP } from '../components/inputCEP';
import { InputTel } from '../components/inputTel';
import { InputNumber } from '../components/inputNumber';

import { maskCNPJ } from '../../../misc/commom_functions';
import { Toast } from '../../../components/toasty';

export const NewFranquiaModal = ({ open, onClose }) => {
	const theme = useTheme();
	const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [wait, setWait] = useState(false);
	const [newFranquiaData, setNewFranquiaData] = useState(
		NEW_FRANQUIA_FORM_INITIAL_STATE
	);

	const handleSubmit = async () => {
		setWait(true);
		let toastId = null;
		toastId = Toast('Aguarde...', 'wait');

		try {
			await api.post('/administrar/franquia', {
				FormData: {
					...newFranquiaData,
					CNPJss: maskCNPJ(newFranquiaData.CNPJ),
				},
			});

			Toast('Filial criada!', 'update', toastId, 'success');
			setNewFranquiaData(NEW_FRANQUIA_FORM_INITIAL_STATE);
			setWait(false);
		} catch (err) {
			Toast('Falha ao criar filial', 'update', toastId, 'error');
			setWait(false);
		}

		setWait(false);
	};

	const handleClose = () => {
		if (!wait) {
			onClose();
			handleDiscart();
		}
	};

	const handleDiscart = () => {
		setNewFranquiaData(NEW_FRANQUIA_FORM_INITIAL_STATE);
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			maxWidth={false}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle onClose={handleClose}>Nova Franquia</DialogTitle>

			<DialogContent dividers>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Identificação
						</Typography>
					</li>
					<div className={classes.line}>
						<InputNumber
							value={newFranquiaData.GrpVen}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									GrpVen: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={6}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='Grupo de Venda'
						/>
						<InputNumber
							value={newFranquiaData.Filial}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									Filial: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={4}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='Código Filial'
						/>
					</div>

					<div className={classes.line}>
						<InputNumber
							value={newFranquiaData.CodTOTVs}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									CodTOTVs: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={6}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='Código TOTVs'
						/>
						<InputNumber
							value={newFranquiaData.LojaTOTVs}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									LojaTOTVs: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={2}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='Loja TOTVs'
						/>
					</div>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Dados
						</Typography>
					</li>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.Franqueado}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									Franqueado: e.target.value,
								}));
							}}
							label='Titular da Franquia'
							variant='outlined'
							disabled={wait}
						/>
					</div>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.RazaoSocial}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									RazaoSocial: e.target.value,
								}));
							}}
							label='Razão Social'
							variant='outlined'
							disabled={wait}
						/>
					</div>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.NomeFantasia}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									NomeFantasia: e.target.value,
								}));
							}}
							label='Nome Fantasia'
							variant='outlined'
							disabled={wait}
						/>
					</div>

					<div className={classes.line}>
						<FormControl className={classes.formControl}>
							<InputLabel id='demo-123'>Tipo Pessoa</InputLabel>
							<Select
								labelId='demo-123'
								id='demo-simple-select-123'
								value={newFranquiaData.Tipo}
								onChange={(e) =>
									setNewFranquiaData((oldState) => ({
										...oldState,
										Tipo: e.target.value,
										CNPJ: '',
									}))
								}
								disabled={wait}
							>
								<MenuItem value='J'>Jurídica</MenuItem>
								<MenuItem value='F'>Física</MenuItem>
							</Select>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel id='demo-456'>Consultor</InputLabel>
							<Select
								labelId='demo-456'
								id='demo-simple-select-456'
								value={newFranquiaData.Consultor}
								onChange={(e) =>
									setNewFranquiaData((oldState) => ({
										...oldState,
										Consultor: e.target.value,
									}))
								}
								disabled={wait}
							>
								<MenuItem value='ALESSANDRO'>Alessandro</MenuItem>
								<MenuItem value='TATIANE'>Tatiane</MenuItem>
								<MenuItem value='IRES'>Ires</MenuItem>
								<MenuItem value='ANDREA'>Andrea</MenuItem>
							</Select>
						</FormControl>
					</div>

					<div className={classes.line}>
						<InputCNPJ
							className={classes.TextInput}
							value={newFranquiaData.CNPJ}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									CNPJ: e.target.value,
								}));
							}}
							Tipo={newFranquiaData.Tipo}
							disabled={wait}
						/>
						<InputNumber
							value={newFranquiaData.IE}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									IE: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={14}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='Inscrição Estadual'
						/>
					</div>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Contato
						</Typography>
					</li>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.Email}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									Email: e.target.value,
								}));
							}}
							label='Email'
							variant='outlined'
							disabled={wait}
						/>
					</div>

					<div className={classes.line}>
						<InputTel
							className={classes.TextInput}
							value={newFranquiaData.TelCel}
							onChange={(e) =>
								setNewFranquiaData((oldState) => ({
									...oldState,
									TelCel: e.target.value,
								}))
							}
							disabled={wait}
						/>
					</div>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Fiscal
						</Typography>
					</li>
					<div className={classes.line}>
						<InputNumber
							value={newFranquiaData.CNAE}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									CNAE: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={7}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='CNAE'
						/>
						<InputNumber
							value={newFranquiaData.FPAS}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									FPAS: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={4}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='FPAS'
						/>
					</div>

					<div className={classes.line}>
						<InputNumber
							value={newFranquiaData.NATJUR}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									NATJUR: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={4}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='Natureza Jurídica'
						/>
						<InputNumber
							value={newFranquiaData.NIRE}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									NIRE: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={4}
							decimals={0}
							leadingZero={true}
							className={classes.TextInput}
							label='NIRE'
						/>
					</div>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Faturamento
						</Typography>
					</li>

					<div className={classes.line}>
						<InputNumber
							value={newFranquiaData.Credito}
							onChange={(e) => {
								setNewFranquiaData((oldState) => ({
									...oldState,
									Credito: e.target.value,
								}));
							}}
							disabled={wait}
							maxChar={10}
							decimals={2}
							leadingZero={true}
							className={classes.TextInput}
							label='Crédito(R$)'
						/>
						<FormControlLabel
							style={{
								whiteSpace: 'nowrap',
							}}
							control={
								<Checkbox
									className={classes.checkbox}
									icon={<InsertDriveFileOutlinedIcon />}
									checkedIcon={<InsertDriveFileIcon />}
									checked={newFranquiaData.EmiteNF}
									onChange={(e) => {
										e.persist();
										setNewFranquiaData((oldState) => ({
											...oldState,
											EmiteNF: e.target.checked,
										}));
									}}
									disabled={wait}
								/>
							}
							label='Emite NFe'
						/>
					</div>

					<div className={classes.SliderContainer}>
						<Typography id='discrete-slider-restrict' gutterBottom>
							Mínimo Compra
						</Typography>
						<Slider
							className={classes.Slider}
							defaultValue={newFranquiaData.minCompra}
							valueLabelFormat={valueLabelFormat}
							getAriaValueText={valuetext}
							aria-labelledby='discrete-slider-restrict'
							step={null}
							valueLabelDisplay='auto'
							marks={marks}
							onChange={(e) =>
								setNewFranquiaData((oldState) => ({
									...oldState,
									minCompra: e.target.value,
								}))
							}
							disabled={wait}
						/>
					</div>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Configurações
						</Typography>
					</li>

					<div className={classes.line}>
						<FormControl className={classes.formControl}>
							<InputLabel id='demo-101112'>Confiável</InputLabel>
							<Select
								labelId='demo-101112'
								id='demo-simple-select-101112'
								value={newFranquiaData.confiavel}
								onChange={(e) =>
									setNewFranquiaData((oldState) => ({
										...oldState,
										confiavel: e.target.value,
									}))
								}
								disabled={wait}
							>
								<MenuItem value={true}>Sim</MenuItem>
								<MenuItem value={false}>Não</MenuItem>
							</Select>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel id='demo-202122'>Pode retirar</InputLabel>
							<Select
								labelId='demo-202122'
								id='demo-simple-select-202122'
								value={newFranquiaData.retira}
								onChange={(e) =>
									setNewFranquiaData((oldState) => ({
										...oldState,
										retira: e.target.value,
									}))
								}
								disabled={wait}
							>
								<MenuItem value={true}>Sim</MenuItem>
								<MenuItem value={false}>Não</MenuItem>
							</Select>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel id='demo-131415'>Condição de Pagamento</InputLabel>
							<Select
								labelId='demo-131415'
								id='demo-simple-select-131415'
								value={newFranquiaData.CondPag}
								onChange={(e) =>
									setNewFranquiaData((oldState) => ({
										...oldState,
										CondPag: e.target.value,
									}))
								}
								disabled={wait}
							>
								<MenuItem value='003'>28 DDL</MenuItem>
								<MenuItem value='004'>35 DDL</MenuItem>
								<MenuItem value='005'>42 DDL</MenuItem>
								<MenuItem value='006'>45 DDL</MenuItem>
							</Select>
						</FormControl>
					</div>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Endereço
						</Typography>
					</li>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.Logradouro}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									Logradouro: e.target.value,
								}));
							}}
							label='Logradouro'
							variant='outlined'
							disabled={wait}
						/>
					</div>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.Bairro}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									Bairro: e.target.value,
								}));
							}}
							label='Bairro'
							variant='outlined'
							disabled={wait}
						/>
					</div>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.Municipio}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									Municipio: e.target.value,
								}));
							}}
							label='Município'
							variant='outlined'
							disabled={wait}
						/>
					</div>
					<FormControl className={classes.formControl}>
						<InputLabel id='demo-789'>UF</InputLabel>
						<Select
							labelId='demo-789'
							id='demo-simple-select-789'
							value={newFranquiaData.UF}
							onChange={(e) =>
								setNewFranquiaData((oldState) => ({
									...oldState,
									UF: e.target.value,
								}))
							}
							disabled={wait}
						>
							{estados.map((Ufs) => (
								<MenuItem value={Ufs.UF}>{Ufs.estado}</MenuItem>
							))}
						</Select>
					</FormControl>
					<div className={classes.line}>
						<InputCEP
							className={classes.TextInput}
							value={newFranquiaData.CEP}
							onChange={(e) =>
								setNewFranquiaData((oldState) => ({
									...oldState,
									CEP: e.target.value,
								}))
							}
							disabled={wait}
						/>
					</div>
					<div className={classes.line}>
						<TextField
							className={classes.TextInput}
							value={newFranquiaData.Complemento}
							onChange={(e) => {
								e.persist();
								setNewFranquiaData((oldState) => ({
									...oldState,
									Complemento: e.target.value,
								}));
							}}
							label='Complemento'
							variant='outlined'
							disabled={wait}
						/>
					</div>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
							marginBottom: '8px',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Acesso
						</Typography>
					</li>
					<TextField
						className={classes.TextInput}
						value={newFranquiaData.Senha}
						type='password'
						onChange={(e) => {
							e.persist();
							setNewFranquiaData((oldState) => ({
								...oldState,
								Senha: e.target.value,
							}));
						}}
						label='Senha de Acesso'
						variant='outlined'
						disabled={wait}
					/>
				</div>
			</DialogContent>

			<DialogActions>
				<Button
					onClick={handleSubmit}
					variant='contained'
					color='primary'
					startIcon={<SaveIcon />}
					disabled={wait}
				>
					Salvar
				</Button>
				<Button
					onClick={handleDiscart}
					variant='outlined'
					color='secondary'
					startIcon={<DeleteForeverIcon />}
					disabled={wait}
				>
					Limpar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	TextInput: {
		width: '100%',
		maxWidth: '413px',
		margin: '0px 8px',
		'& div>input:nth-child(1)': {
			marginLeft: '8px',
		},
	},
	line: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		width: '100%',
		heigth: '100%',
		margin: '0px 0px 8px 0px',
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	checkbox: {
		transform: 'scale(0.3)',
	},
	SliderContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		marginBottom: '8px',
	},
	Slider: {
		width: '80%',
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

const NEW_FRANQUIA_FORM_INITIAL_STATE = {
	GrpVen: '',
	CodTOTVs: '',
	LojaTOTVs: '',
	Filial: '',
	Franqueado: '',
	RazaoSocial: '',
	NomeFantasia: '',
	Tipo: 'J',
	CNPJ: '',
	Email: '',
	Consultor: 'TATIANE',
	Credito: '',
	CNAE: '',
	EmiteNF: false,
	UF: 'SP',
	minCompra: 50,
	retira: true,
	maxLeads: 5,
	confiavel: true,
	CondPag: '003',
	Logradouro: '',
	Municipio: '',
	CEP: '',
	Bairro: '',
	Complemento: '',
	FPAS: '515',
	CodMun: '',
	NIRE: '',
	NATJUR: '',
	IE: '',
	TelCel: '',
	Senha: '',
	CNPJss: '',
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

const marks = [
	{
		value: 0,
		label: 'R$ 0,00',
	},
	{
		value: 50,
		label: 'R$ 600,00',
	},
	{
		value: 100,
		label: 'R$ 1.200,00',
	},
];

function valuetext(value) {
	return `${value}°C`;
}

function valueLabelFormat(value) {
	return marks.findIndex((mark) => mark.value === value) + 1;
}
