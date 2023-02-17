import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	margin: {
		margin: theme.spacing(1),
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: '15ch',
		'& #outlined-start-adornment': {
			border: 'none',
			borderBottom: 'none',
		},
		'& #outlined-start-adornment:focus': {
			border: 'none  ',
			borderBottom: 'none  ',
		},
	},
}));

let Decimais = 4;

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			style={{ border: 'none' }}
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			decimalScale={Decimais}
			thousandSeparator='.'
			decimalSeparator=','
			fixedDecimalScale={true}
			isNumericString
			prefix=''
			allowNegative={false}
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

function InputAdornments(props) {
	const classes = useStyles();
	const [values, setValues] = React.useState({
		numberformat: '1320',
	});

	const { TipoValidador, Pagamento } = props.State;

	useEffect(() => {
		Decimais = validaEntrada(Pagamento, TipoValidador);
	}, [TipoValidador, Pagamento]);

	const handleChange = (event) => {
		setValues({
			...values,
			[event.target.name]: event.target.value,
		});

		props.onChange(event);
	};

	return (
		<div className={classes.root}>
			<TextField
				name='numberformat'
				id='formatted-numberformat-input'
				label={props.label}
				disabled={props.disabled}
				className={clsx(classes.margin, classes.textField)}
				onChange={handleChange}
				InputProps={{
					inputComponent: NumberFormatCustom,
					startAdornment: (
						<InputAdornment position='start'>
							{`${defineDecorator(TipoValidador)}:`}
						</InputAdornment>
					),
				}}
				variant='outlined'
				value={
					typeof props.value != 'undefined' && props.value !== null
						? props.value
						: ''
				}
			/>
		</div>
	);
}

const mapStateToProps = (store) => ({
	State: store.solicitacaoState,
});

export default connect(mapStateToProps)(InputAdornments);

const defineDecorator = (TipoValidador) => {
	/*no fim das contas os preços pagos em ficha ainda contam como R$ 
    então não tem necessidade de exibir uma unidade monetária 'F$'*/
	if (TipoValidador === 'Ficha') {
		return 'R$';
		// return "Ficha";
	} else if (TipoValidador === 'Moeda e Ficha') {
		return 'R$';
		// return "$/F";
	} else {
		return 'R$';
	}
};

const validaEntrada = (Pagamento, TValidador) => {
	//retorno as casas decimais que o campo deve aceitar
	switch (Pagamento) {
		case 'Sem Pagamento':
			return 4;
		case 'Cartão':
			return 4;
		case 'Validador':
			if (TValidador === 'Ficha') {
				return 0;
			} else {
				return 4;
			}
		case 'Cartão e Validador':
			if (TValidador === 'Ficha') {
				return 0;
			} else {
				return 4;
			}
		default:
			return 4;
	}
};
