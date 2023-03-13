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

	//useEffect(() => {
//		setClientes(ClientesEnderecos);
	//}, [ClientesEnderecos]);

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
			} catch (err) {console.log('deu erro 957421')}
		}

		loadClientData();
		return () => isRunning = false;

	}, [ClientesSearchParam], [open], [Clientes]); 	
	/*
	React.useEffect(() => {
		if (!open) {
			setClientes([]);
		}
	  }, [open]);
	*/
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
					console.log('ondex: :' + index);
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
			
			<div>{`Cliente_Destino: ${Cliente_Destino !== null ? `'${Cliente_Destino}'` : 'null'}`}</div>
      		<div>{`CNPJ_Destino: ${CNPJ_Destino !== null ? `'${CNPJ_Destino}'` : 'null'}`}</div>
			<div>{`Endereço_Entrega: ${Endereço_Entrega !== null ? `'${Endereço_Entrega}'` : 'null'}`}</div>

			<br />
			<form className={classes.root} noValidate autoComplete='off'>
				<div>
					<Autocomplete
						id="clientaddressid"
						MLeft='8px'
						MBottom='8px'
						className={classes.inputRoot}
						value={Cliente_Destino !== '' ? Cliente_Destino + ", CNPJ: " + CNPJ_Destino : ''}
						onChange={(e, newValue) => {defineCliente(newValue);}}
						//groupBy={(option) => option.Nome_Fantasia}
						//inputValue={inputValue}
						//onInputChange={(event, newInputValue) => {
						//setInputValue(newInputValue);
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
						//isOptionEqualToValue={(option, value) => option.title === value.title}
						isOptionEqualToValue={(option, value) => option.CNPJss === value.CNPJss && option.Nome_Fantasia === value.Nome_Fantasia}
						//isOptionEqualToValue={(option, value) => value === "" || option.CNPJss === value.CNPJss && option.Nome_Fantasia === value.Nome_Fantasia}
						//isOptionEqualToValue={(option, value) => option.Nome_Fantasia + ', CNPJ: ' + option.CNPJss === value}
						
						
						//getOptionSelected={(option, value) => (option.CNPJss === value.CNPJss) }
						//getOptionLabel={(option) => option.Nome_Fantasia !== undefined ? option.Nome_Fantasia + ', CNPJ: ' + option.CNPJss : ''}
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
							//condicao='*Nenhum cliente encontrado' 
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
		{/*
			<form className={classes.root} noValidate autoComplete='off'>
				<div>
					<TextField
						style={{ width: '400px' }}
						id='outlined-multiline-flexible'
						label='Endereço de entrega'
						helperText={Cliente_Destino === '' ? '*Selecione um cliente' : null}
						multiline
						rowsMax={4}
						disabled={Cliente_Destino === '' ? true : false}
						value={Endereço_Entrega}
						onChange={(e) => mudarEndereco(e.target.value)}
						variant='outlined'
					/>
				</div>
			</form>
		*/}

		{/*}
			<Selecao
				width='500px'
				MLeft='8px'
				MBottom='8px'
				label='Endereço de entrega'
				value={Endereço_Entrega}
				disabled={Cliente_Destino === '' || shouldShowClientes(Clientes.filter((option)=>(option.Nome_Fantasia === Cliente_Destino && option.CNPJss === CNPJ_Destino))) ? true : false }
				onChange={(e) => mudarEndereco(e.target.value)}
			>
				{Clientes.filter((option)=>(option.Nome_Fantasia === Cliente_Destino && option.CNPJss === CNPJ_Destino)).map((cliente) => (
					<MenuItem value={enderecoEntrega(cliente)} key={cliente.CNPJss + cliente.Nome_Fantasia}>
						{enderecoEntrega(cliente)}
					</MenuItem>
				))}
			</Selecao>
		*/}

			<form className={classes.root} noValidate autoComplete='off'>
				<div>
					<Autocomplete
						id="addressid"
						MLeft='8px'
						MBottom='8px'
						className={classes.inputRoot}
						value={Endereço_Entrega}
						//onChange={(e, newValue) => {defineCliente(newValue);}}
						//onChange={(e) => mudarEndereco(e.target.value)}
						//groupBy={(option) => option.Nome_Fantasia}
						//inputValue={Endereço_Entrega}
						//onInputChange={(event, newInputValue) => { 
						onInputChange={(event, newInputValue) => mudarEndereco(enderecoEntrega(newInputValue))}
						freeSolo={true}
							
						//setInputValue(newInputValue);
						filterOptions={(x) => x} //Disable filter
						sx={{ width: '500px'}}
						open={openEndereco}
						onOpen={(e) => {
							setOpenEndereco(true);
						}}
						onClose={() => {
							setOpenEndereco(false);
						}}
						//onChange={(e) => {alert('change: ' + e.target.value); defineCliente(e.target.value); } }
						//onKeyDown={(e) => { if ( e.key.length === 1 || e.key === "Delete" || e.key === "Backspace" ) { setClientesSearchParam(e.key.length === 1 ? e.target.value  + e.key: e.key === "Backspace" || e.key === "Delete"? e.target.value.substring(1, e.target.value.length ): e.target.value ); } else { if ( !(e.key === "ArrowLeft" || e.key === "ArrowRight" ||  e.key === "Enter") ) {e.preventDefault() } } ; console.log(e.target.value  + '-' + e.key ) } }
						//onKeyUp={(e) => { setClientesSearchParam(e.target.value ); } }
						//isOptionEqualToValue={(option, value) => option.title === value.title}
						isOptionEqualToValue={(option, value) => {
								console.log('isOptionEqualToValue');
								console.dir(option);
								console.dir(value);
								//return enderecoEntrega(option) === enderecoEntrega(value);
								return enderecoEntrega(option) === enderecoEntrega(value);
							}	
						}
						
						//getOptionSelected={(option, value) => (option.CNPJss === value.CNPJss) }
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
							//condicao='*Nenhum endereço encontrado' 
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
		// color: "purple",
		// This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
		
		//'&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
		'& .MuiOutlinedInput-root .MuiAutocomplete-input:first-child': {
		  // Default left padding is 6px
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
	console.log('enderecoEntrega: ' + typeof (cliente));
	console.dir(cliente);
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
