import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DatePicker } from 'react-materialize';

import Selecao from '../../../components/materialComponents/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Rotulo, Campo } from '../../../components/commom_in';

import Autocomplete from '@mui/material/Autocomplete';
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import { api } from '../../../services/api';

import {
	ChooseCliente,
	ChangeEndereco,
	ChooseData,
	DefineContato,
	ChooseTelefone,
	ChooseEmail,
	DefineOBS,
} from '../../../global/actions/SolicitacaoAction';

function Entrega(props) {
	const classes = useStyles();
	const [Clientes, setClientes] = useState([]);
	const [ClientesSearchParam, setClientesSearchParam] = useState("");
	const [open, setOpen] = React.useState(false);
	const loading = open && Clientes.length === 0;

	const [openEndereco, setOpenEndereco] = React.useState(false);
	const loadingEndereco = openEndereco && Clientes.length === 0;	
	
	const {
		ChooseCliente,
		ChangeEndereco,
		ChooseData,
		DefineContato,
		ChooseTelefone,
		DefineOBS,
	} = props;

	const {
		Cliente_Destino,
		Endereço_Entrega,
		CNPJ_Destino,
		Telefone_Contato,
		Observacao,
		Data_Entrega_Desejada,
		Contato,
		MinDDLEnvio,
		//ClientesEnderecos,
	} = props.State;

	const dataMinimaSolicitacao = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate() + MinDDLEnvio
	);

	useEffect(() => {
		let isRunning = true;
		async function loadClientData() {
			try {
				const response = await api.get(`/equip/requests/getclientaddresses/s${ClientesSearchParam}`); //O "s" sozinho está correto, serve para não dar erro de rota sem digitação no parâmetro.

				if (isRunning) {
					setClientes(response.data.endereços);
					if (response.data.endereços.length === 0){
						setOpen(false);
					}
				}
			} catch (err) {console.log('Err. N.: 957421')}
		}

		loadClientData();
		return () => isRunning = false;

	}, [ClientesSearchParam], [open], [Clientes]); 	

	const defineCliente = (cliente) => {
		if (cliente === null || cliente === '' || Clientes.length === 0 ) {
			ChooseCliente({
				Nome_Fantasia: '',
				CNPJss: '',
			});
			ChangeEndereco('');
		} else {
			Clientes.filter((client) => (client.CNPJss === cliente.CNPJss && client.Nome_Fantasia === cliente.Nome_Fantasia)).map((client, index) => {

				if (client.CNPJss === cliente.CNPJss && client.Nome_Fantasia === cliente.Nome_Fantasia ) {
					
					ChooseCliente(client);
					if (index === 0) {
						ChangeEndereco(enderecoEntrega(client))
					}

				}
				return null;
			});
		}
	};

	const mudarEndereco = (value) => {
		ChangeEndereco(value);
	};

	return (
		<>
			<form className={classes.root} noValidate autoComplete='off'>
				<div>
					<Autocomplete
						id="clientaddressid"
						MLeft='8px'
						MBottom='8px'
						className={classes.inputRoot}
						value={Cliente_Destino !== '' ? Cliente_Destino + ", CNPJ: " + CNPJ_Destino : ''}
						onChange={(e, newValue) => {defineCliente(newValue);}}
						filterOptions={(x) => x} //Disable filter
						sx={{ width: '500px'}}
						open={open}
						onOpen={(e) => {
							setOpen(true);
						}}
						onClose={() => {
							setOpen(false);
						}}

						onKeyUp={(e) => { setClientesSearchParam(e.target.value ); } }
						isOptionEqualToValue={(option, value) => option.CNPJss === value.CNPJss && option.Nome_Fantasia === value.Nome_Fantasia}
						options={Clientes}
						loading={loading}
						renderOption={(props, option) => (
							<Box component="li" {...props} key={option.CNPJss + option.Nome_Fantasia} >
							{option.Nome_Fantasia}, CNPJ: {option.CNPJss}
						</Box>
						)}
						renderInput={(params) => (
							<TextField
							{...params}
							label='Cliente'
							style={{ width: '500px'}}
							className={classes.inputRoot}
							variant="outlined"
							InputProps={{
								...params.InputProps,
								endAdornment: (
								<React.Fragment>
									{loading ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
								),
							}}
							/>
						)}
					/>
				</div>
			</form>

			<form className={classes.root} noValidate autoComplete='off'>
				<div>
					<Autocomplete
						id="addressid"
						MLeft='8px'
						MBottom='8px'
						className={classes.inputRoot}
						value={Endereço_Entrega}
						onInputChange={(event, newInputValue) => mudarEndereco(enderecoEntrega(newInputValue))}
						freeSolo={true}
						filterOptions={(x) => x} //Disable filter
						sx={{ width: '500px'}}
						open={openEndereco}
						onOpen={(e) => {
							setOpenEndereco(true);
						}}
						onClose={() => {
							setOpenEndereco(false);
						}}
						isOptionEqualToValue={(option, value) => {
								return enderecoEntrega(option) === enderecoEntrega(value);
							}	
						}
						getOptionLabel={(option) => enderecoEntrega(option)}
						options={Clientes.filter((option)=>(option.Nome_Fantasia === Cliente_Destino && option.CNPJss === CNPJ_Destino))}
						loading={loadingEndereco}
						renderOption={(props, option) => (
							<Box component="li" {...props} value={enderecoEntrega(option)} key={option.CNPJss + enderecoEntrega(option)} >
							{enderecoEntrega(option)}
						</Box>
						)}
						renderInput={(params) => (
							<TextField
							{...params}
							label='Endereço de entrega'
							style={{ width: '500px'}}
							className={classes.inputRoot}
							variant="outlined"
							InputProps={{
								...params.InputProps,
								endAdornment: (
								<React.Fragment>
									{loading ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</React.Fragment>
								),
							}}
							/>
						)}
					/>
				</div>
			</form>

			<div className='XAlign' style={{ justifyContent: 'flex-start' }}>
				<Campo>
					<Rotulo>Data mínima possivel({MinDDLEnvio}D)</Rotulo>
					{dataMinima(MinDDLEnvio)}
				</Campo>

				<Campo>
					<Rotulo>Data de Entrega Desejada</Rotulo>
					<DatePicker
						placeholder='Clique aqui'
						style={{
							all: 'unset',
							borderBottom: '1px solid #ccc',
						}}
						value={dataFormatada(Data_Entrega_Desejada)}
						onChange={(e) => ChooseData(e)}
						options={{
							autoClose: true,
							container: null,
							defaultDate: null,
							disableDayFn: null,
							disableWeekends: true,
							events: [],
							firstDay: 0,
							format: 'mmm dd, yyyy',
							i18n: datepickerconfig,
							isRTL: false,
							maxDate: null,
							minDate: dataMinimaSolicitacao,
							onClose: null,
							onDraw: null,
							onOpen: null,
							onSelect: null,
							parse: null,
							setDefaultDate: false,
							showClearBtn: true,
							showDaysInNextAndPreviousMonths: false,
							showMonthAfterYear: false,
							yearRange: 1,
						}}
					/>
				</Campo>
			</div>
			<form className={classes.root} noValidate autoComplete='off'>
				<TextField
					id='outlined-basic'
					value={Contato}
					className={classes.TextInput}
					onChange={(e) => DefineContato(e.target.value)}
					label='Contato'
					variant='outlined'
				/>
			</form>
			{/* <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="outlined-basic"
          value={Email_Acompanhamento}
          onChange={(e) => ChooseEmail(e.target.value)}
          label="Email"
          variant="outlined"
        />
      </form> */}
			<form className={classes.root} noValidate autoComplete='off'>
				<TextField
					id='outlined-basic'
					className={classes.TextInput}
					value={Telefone_Contato}
					onChange={(e) => ChooseTelefone(e.target.value)}
					label='Telefone de Contato'
					variant='outlined'
				/>
			</form>
			<form className={classes.root} noValidate autoComplete='off'>
				<div>
					<TextField
						id='outlined-multiline-flexible'
						label='Observações'
						multiline
						maxRows={4}
						value={Observacao}
						onChange={(e) => DefineOBS(e.target.value)}
						variant='outlined'
					/>
				</div>
			</form>
		</>
	);
}

const mapStateToProps = (store) => ({
	State: store.solicitacaoState,
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			ChooseCliente,
			ChangeEndereco,
			ChooseData,
			DefineContato,
			ChooseTelefone,
			ChooseEmail,
			DefineOBS,
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(Entrega);

const shouldShowClientes = (Clientes) => {
	if (Clientes.length === 0) {
		return true;
	} else {
		return false;
	}
};

const dataFormatada = (date) => {
	let x = null;
	try {
		x = new Date(date)
			.toISOString()
			.split('T')[0]
			.replace(/-/g, '/')
			.split('/')
			.reverse()
			.join('/');
	} catch (err) {
		x = '';
	}

	return x;
};

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
			width: '25ch',
		},
	},
	TextInput: {
		'& div>input:nth-child(1)': {
			margin: '0px 8px',
		},
	},
	inputRoot: {
		'& .MuiOutlinedInput-root .MuiAutocomplete-input:first-child': {
		  paddingLeft: 0,
		  paddingRight: 0,
		  paddingTop: 0,
		  paddingBottom: 0,
		},
	},
}));

const datepickerconfig = {
	cancel: 'Cancelar',
	clear: 'Limpar',
	done: 'Confirmar',
	months: [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro',
	],
	monthsShort: [
		'Jan',
		'Fev',
		'Mar',
		'Abr',
		'Mai',
		'Jun',
		'Jul',
		'Ago',
		'Set',
		'Out',
		'Nov',
		'Dez',
	],
	nextMonth: '›',
	previousMonth: '‹',
	weekdays: [
		'Domingo',
		'Segunda',
		'Terça',
		'Quarta',
		'Quinta',
		'Sexta',
		'Sábado',
	],
	weekdaysAbbrev: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
	weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
};

const dataMinima = (DDL = 0) => {
	return new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		new Date().getDate() + DDL
	)
		.toLocaleString()
		.split(' ')[0];
};

const enderecoEntrega = (cliente) => {
	let enderecoCompleto = '';

	if (cliente === null || cliente === undefined  ) return '';

	if  (typeof cliente != 'object' && typeof cliente == 'string') {
		return cliente;
	}

	if (cliente.Logradouro !== null) {
		enderecoCompleto = enderecoCompleto.concat(cliente.Logradouro.trim());
	}

	if (cliente.Número !== null) {
		enderecoCompleto = enderecoCompleto.concat(`, ${cliente.Número.trim()}`);
	}

	if (cliente.Complemento !== null) {
		enderecoCompleto = enderecoCompleto.concat(
			`, ${cliente.Complemento.trim()}`
		);
	}

	if (cliente.Bairro !== null) {
		enderecoCompleto = enderecoCompleto.concat(`, ${cliente.Bairro.trim()}`);
	}

	if (cliente.Município !== null) {
		enderecoCompleto = enderecoCompleto.concat(`, ${cliente.Município.trim()}`);
	}

	if (cliente.UF !== null) {
		enderecoCompleto = enderecoCompleto.concat(`, ${cliente.UF.trim()}`);
	}

	if (cliente.CEP !== null) {
		enderecoCompleto = enderecoCompleto.concat(`, ${cliente.CEP.trim()}`);
	}

	return enderecoCompleto;
};
