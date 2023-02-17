import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ImportExport from '@material-ui/icons/ImportExport';

import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { Toast } from '../../../components/toasty';
import {
	clickButton,
	clearConfig,
} from '../../../global/actions/SolicitacaoAction';
import Selecao from '../../../components/materialComponents/Select';
import Input from './_InputValor';
import { GREY_SECONDARY } from '../../../misc/colors';

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
		backgroundColor: GREY_SECONDARY,
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	button: {
		marginLeft: '8px',
		marginBottom: '8px',
		color: GREY_SECONDARY,
		height: '54px',
		border: `1px solid ${GREY_SECONDARY}`,
		'&:hover': {
			border: `1px solid ${GREY_SECONDARY}`,
		},
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

function FullScreenDialog({
	Padrao,
	State,
	clickButton,
	clearConfig,
	disabled,
}) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [PSelecionado, setPSelecionado] = React.useState([]);
	const [Padroes, setPadroes] = React.useState([]);

	const { Pagamento, Validador, TipoValidador } = State;

	const setValor = (Selecionado, indice, valor) => {
		let ConfigAux = [...Selecionado];

		ConfigAux[indice].Valor = valor;
		setPSelecionado(ConfigAux);
		return;
	};

	const setValor2 = (Selecionado, indice, valor) => {
		let ConfigAux = [...Selecionado];

		ConfigAux[indice].Valor2 = valor;
		setPSelecionado(ConfigAux);
		return;
	};

	const handleClickOpen = () => {
		if (Padrao.length > 0) {
			setPadroes(Padrao);
			setPSelecionado([]);
			setOpen(true);
		} else {
			Toast('Não existem configurações padrão para essa máquina', 'warn');
		}
	};

	const handleClose = () => {
		setPSelecionado([]);
		setOpen(false);
	};

	const handleConfirm = () => {
		let valid = true;
		if (PSelecionado.length === 0) {
			Toast('Nenhuma configuração padrão selecionada', 'warn');
			return;
		}

		clearConfig();

		PSelecionado.forEach((confg) => {
			if (
				(Pagamento === 'Validador' || Pagamento === 'Cartão e Validador') &&
				TipoValidador === 'Ficha'
			) {
				let ficha = null;
				Validador.map((pos) => {
					if (pos.charAt(0) === 'F') {
						ficha = pos;
					}
					return null;
				});
				if (
					typeof confg.Valor != 'undefined'
						? Number(confg.Valor.replace(/,/g, '.')) %
								Number(ficha.replace('F', '')) >
						  0
						: false
				) {
					valid = false;
				}
			}
		});

		if (!valid) {
			Toast(
				'Um ou mais valores não são compativeis com o valor de ficha informado',
				'warn'
			);
			return;
		}

		if (Pagamento !== 'Sem Pagamento') {
			let temValorInválido = false;

			PSelecionado.forEach((confg) => {
				if (
					typeof confg.Valor == 'undefined' ||
					confg.Valor === null ||
					String(confg.Valor).trim() === ''
				) {
					temValorInválido = true;
				}
			});

			if (temValorInválido) {
				alert(
					'Um ou mais valores não informados para bebidas foram definidos automaticamente para R$ 0,00'
				);
			}
		}

		//inclui todas as linhas
		PSelecionado.forEach((confg) => {
			clickButton({
				id: confg.Cod,
				selecao: confg.Selecao,
				bebida: confg.Bebida,
				medida: confg.Qtd_Def,
				tipo: confg.TProd,
				contenedor: confg.Contenedor,
				configura: true,
				valor:
					typeof confg.Valor != 'undefined'
						? Number(confg.Valor.replace(/,/g, '.'))
						: '0',
				valor2:
					typeof confg.Valor2 != 'undefined'
						? Number(confg.Valor2.replace(/,/g, '.'))
						: '0',
			});
		});

		setPSelecionado([]);
		setOpen(false);
	};

	return (
		<div>
			<Button
				variant='outlined'
				color='primary'
				size='large'
				className={classes.button}
				startIcon={<ImportExport />}
				onClick={handleClickOpen}
				disabled={disabled}
			>
				Carregar Padrão
			</Button>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge='start'
							color='inherit'
							onClick={handleClose}
							aria-label='close'
						>
							<CloseIcon />
						</IconButton>
						<Typography variant='h6' className={classes.title}>
							Configuração Padrão
						</Typography>
						<Button color='inherit' onClick={handleConfirm}>
							Carregar
						</Button>
					</Toolbar>
				</AppBar>
				<Selecao
					MLeft='8px'
					MTop='8px'
					width='200px'
					label='Configuração'
					value=''
					onChange={(e) => {
						setPSelecionado(e.target.value);
					}}
				>
					{Padroes.map((config) => (
						<MenuItem value={config}>{config[0].MaqConfigNome}</MenuItem>
					))}
				</Selecao>
				<List>
					<Divider />
					{PSelecionado.map((selecao, i) => (
						<>
							<ListItem key={selecao.Cod}>
								<ListItemText
									primary={`${selecao.Selecao}. ${selecao.Bebida}`}
									secondary={`${selecao.Qtd_Def}ML, ${selecao.TProd}`}
								/>
								<ListItemSecondaryAction>
									<div className='XAlign'>
										<Input
											onChange={(e) =>
												setValor(PSelecionado, i, e.target.value)
											}
											label='Valor Real'
											value={
												typeof selecao.Valor != 'undefined'
													? selecao.Valor
													: null
											}
										/>
										<Input
											onChange={(e) =>
												setValor2(PSelecionado, i, e.target.value)
											}
											label='Complementar'
											value={
												typeof selecao.Valor2 != 'undefined'
													? selecao.Valor2
													: null
											}
										/>
									</div>
								</ListItemSecondaryAction>
							</ListItem>
							<Divider />
						</>
					))}
				</List>
			</Dialog>
		</div>
	);
}

const mapDispatchToProps = (dispatch) =>
	bindActionCreators({ clickButton, clearConfig }, dispatch);

const mapStateToProps = (store) => ({
	State: store.solicitacaoState,
});

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenDialog);
