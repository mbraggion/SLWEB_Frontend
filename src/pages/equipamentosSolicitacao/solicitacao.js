import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { api } from '../../services/api';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Grow from '@material-ui/core/Grow';

import Requisicao from './solicitacao/_Maquina';
import Detalhes from './solicitacao/_Detalhes';
import Entrega from './solicitacao/_Entrega';
import { Toast } from '../../components/toasty';
import { RED_SECONDARY } from '../../misc/colors';
import Loading from '../../components/loading_screen';
import {
	LoadAtivos,
	LoadBebidas,
//	LoadClientesEnderecos,
	LoadMinDDL,
	LoadHelper,
	ResetRequest,
} from '../../global/actions/SolicitacaoAction';

function VerticalLinearStepper(props) {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const [desativar, setDesativar] = useState(false);
	const steps = getSteps();
	const [open, setOpen] = useState(false);

	const { Maquina, Ajudas } = props.State;

	const {
		LoadAtivos,
		LoadBebidas,
//		LoadClientesEnderecos,
		LoadMinDDL,
		LoadHelper,
		ResetRequest,
	} = props;

	useEffect(() => {
		async function loadData() {
			try {
				const response = await api.get('/equip/requests/getequipconfig');

				LoadAtivos(response.data.MaquinasDisponiveis);
				LoadBebidas(response.data.BebidasNovo);
				//LoadClientesEnderecos(response.data.endereços);
				LoadMinDDL(response.data.MinDDL);
				LoadHelper(response.data.newAjudas);
				setLoaded(true);
			} catch (err) {}
		}
		loadData();
	}, [LoadAtivos, LoadBebidas, LoadHelper, LoadMinDDL]); 
	//}, [LoadAtivos, LoadBebidas, LoadClientesEnderecos, LoadHelper, LoadMinDDL]);

	useEffect(() => {
		return () => {
			ResetRequest();
		};
	}, [ResetRequest]);

	const Solicitacao = {
		MaquinaId: props.State.MaquinaId,
		Maquina: props.State.Maquina,
		Contenedor: props.State.Contenedor,
		Configuracao: props.State.Configuracao,
		Pagamento: props.State.Pagamento,
		Validador: props.State.Validador,
		TipoValidador: props.State.TipoValidador,
		InibirCopos: props.State.InibirCopos,
		Corporativa: props.State.Corporativa,
		Gabinete: props.State.Gabinete,
		Abastecimento: props.State.Abastecimento,
		Chip: props.State.Chip,
		AntExt: props.State.AntExt,
		Cliente_Destino: props.State.Cliente_Destino,
		CNPJ_Destino: props.State.CNPJ_Destino,
		Endereço_Entrega: props.State.Endereço_Entrega,
		Data_Entrega_Desejada: props.State.Data_Entrega_Desejada,
		Contato: props.State.Contato,
		Email_Acompanhamento: props.State.Email_Acompanhamento,
		Telefone_Contato: props.State.Telefone_Contato,
		Observacao: props.State.Observacao,
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return !loaded ? (
		<Loading />
	) : (
		<div className={classes.root}>
			<Stepper activeStep={activeStep} orientation='vertical'>
				{steps.map((label, index) => (
					<Step key={label}>
						<StepLabel className={classes.Circle}>{label}</StepLabel>
						<StepContent>
							<Typography>{getStepContent(index)}</Typography>
							<div className={classes.actionsContainer}>
								<div>
									<Button
										disabled={activeStep === 0}
										onClick={handleBack}
										className={classes.buttonWhite}
									>
										Anterior
									</Button>
									<Button
										variant='contained'
										color='primary'
										onClick={handleNext}
										className={classes.buttonTheme}
									>
										{activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
									</Button>
								</div>
							</div>
							<Fab
								className={classes.fab}
								color='primary'
								onClick={handleClickOpen}
							>
								?
							</Fab>
							<Dialog
								open={open}
								onClose={handleClose}
								PaperComponent={PaperComponent}
								TransitionComponent={Transition}
								aria-labelledby='draggable-dialog-title'
							>
								<DialogTitle
									style={{ cursor: 'move' }}
									id='draggable-dialog-title'
								>
									Ajuda ({activeStep + 1}/{steps.length})
								</DialogTitle>
								<DialogContent>
									<DialogContentText>
										{wichHelpShow(activeStep, Maquina, Ajudas)}
									</DialogContentText>
								</DialogContent>
								<DialogActions style={{ padding: '8px 24px' }}>
									<Button onClick={handleClose} color='primary'>
										Fechar
									</Button>
								</DialogActions>
							</Dialog>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<Paper square elevation={0} className={classes.resetContainer}>
					<Typography>Pronto para validar e enviar a solicitação!</Typography>
					<Button
						disabled={activeStep === 0}
						onClick={handleBack}
						className={classes.buttonWhite}
					>
						Anterior
					</Button>
					<Button
						disabled={desativar}
						onClick={(e) =>
							handleSubmit(
								Solicitacao,
								setDesativar,
								ResetRequest,
								setActiveStep
							)
						}
						className={classes.altButton}
						endIcon={<Icon>send</Icon>}
					>
						{desativar ? 'Validando...' : 'Solicitar'}
					</Button>
				</Paper>
			)}
		</div>
	);
}

const mapStateToProps = (store) => ({
	State: store.solicitacaoState,
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			LoadAtivos,
			LoadBebidas,
			//LoadClientesEnderecos,
			LoadMinDDL,
			LoadHelper,
			ResetRequest,
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(VerticalLinearStepper);

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	buttonTheme: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
		backgroundColor: RED_SECONDARY,

		'&:hover': {
			backgroundColor: RED_SECONDARY,
		},
	},
	buttonWhite: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
		backgroundColor: '#FFFFFF',
	},
	altButton: {
		marginTop: theme.spacing(1),
		marginRight: theme.spacing(1),
		color: '#FFFFFF',
		backgroundColor: RED_SECONDARY,
		'&:hover': {
			backgroundColor: RED_SECONDARY,
		},
	},
	actionsContainer: {
		marginBottom: theme.spacing(2),
	},
	resetContainer: {
		padding: theme.spacing(3),
	},
	fab: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
	Circle: {
		'& > span svg circle': {
			color: RED_SECONDARY,
		},
		'& > span svg path': {
			color: RED_SECONDARY,
		},
	},
}));

function getSteps() {
	return ['Máquina e Configuração', 'Detalhes', 'Entrega'];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return <Requisicao />;
		case 1:
			return <Detalhes />;
		case 2:
			return <Entrega />;
		default:
			return 'Unknown step';
	}
}

function PaperComponent(props) {
	return (
		<Draggable
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

const wichHelpShow = (step, Maquina, Ajudas) => {
	switch (step) {
		case 0:
			return (
				<ul>
					{Ajudas.filter(
						(help) => help.section > 100 && help.section < 200
					).map((hlp) => (
						<li key={hlp.ParamId} style={{ marginBottom: '10px' }}>
							<div>
								<strong>{hlp.name}: </strong>
								<div
									style={{ all: 'unset' }}
									dangerouslySetInnerHTML={{ __html: hlp.text }}
								/>
								<br />
							</div>
						</li>
					))}
				</ul>
			);
		case 1:
			return (
				<ul>
					{Ajudas.filter(
						(help) => help.section > 200 && help.section < 300
					).map((hlp) => (
						<li key={hlp.ParamId} style={{ marginBottom: '10px' }}>
							<div>
								<strong>{hlp.name}: </strong>
								<div
									style={{ all: 'unset' }}
									dangerouslySetInnerHTML={{ __html: hlp.text }}
								/>
								<br />
							</div>
						</li>
					))}
				</ul>
			);
		case 2:
			return (
				<ul>
					{Ajudas.filter(
						(help) => help.section > 300 && help.section < 400
					).map((hlp) => (
						<li key={hlp.ParamId} style={{ marginBottom: '10px' }}>
							<div>
								<strong>{hlp.name}: </strong>
								<div
									style={{ all: 'unset' }}
									dangerouslySetInnerHTML={{ __html: hlp.text }}
								/>
								<br />
							</div>
						</li>
					))}
				</ul>
			);
		default:
			return 'Ajuda não encontrada para esse passo';
	}
};

const handleSubmit = async (
	Solicitacao,
	setDesativar,
	ResetarState,
	ResetarStep
) => {
	setDesativar(true);

	if (Solicitacao.Maquina === '') {
		Toast('Escolha um modelo de máquina', 'warn');
		setDesativar(false);
		return;
	}

	if (Solicitacao.Pagamento === '') {
		Toast('Selecione o meio de pagamento para a máquina', 'warn');
		setDesativar(false);
		return;
	}

	if (
		(Solicitacao.Pagamento === 'Validador' ||
			Solicitacao.Pagamento === 'Cartão e Validador') &&
		Solicitacao.TipoValidador === 'Ficha' &&
		Solicitacao.Validador.length === 0
	) {
		Toast('Especifique que fichas o validador deve acompanhar', 'warn');
		setDesativar(false);
		return;
	}

	if (Solicitacao.Configuracao.length < 1) {
		Toast('Selecione pelo menos uma bebida para a máquina', 'warn');
		setDesativar(false);
		return;
	}

	if (Solicitacao.Corporativa === '') {
		Toast('Especifique se a máquina é corporativa', 'warn');
		setDesativar(false);
		return;
	}

	// if (Solicitacao.Gabinete === "") {
	//   Toast("Selecione se deseja um gabinete acompanhando a máquina", 'warn');
	//   setDesativar(false);
	//   return;
	// }

	if (Solicitacao.Abastecimento === '') {
		Toast('Selecione o sistema de abastecimento hídrico', 'warn');
		setDesativar(false);
		return;
	}

	// Verificação desativada por solicitação do Alberto
	// if (Solicitacao.Chip === "") {
	//   Toast(
	//     "Informe qual chip de operadora deve acompanhar a telemetria da máquina", 'warn'
	//   );
	//   setDesativar(false);
	//   return;
	// }

	if (Solicitacao.AntExt === '') {
		Toast('Informe se o a máquina deve acompanhar uma antena externa', 'warn');
		setDesativar(false);
		return;
	}

	if (Solicitacao.Cliente_Destino === '') {
		Toast('Informe qual cliente receberá a máquina', 'warn');
		setDesativar(false);
		return;
	}

	if (Solicitacao.Endereço_Entrega === '') {
		Toast('O endereço de entrega não pode estar vazio', 'warn');
		setDesativar(false);
		return;
	}

	if (Solicitacao.Data_Entrega_Desejada === '') {
		Toast('Preencha uma data conveniente para entrega', 'warn');
		setDesativar(false);
		return;
	}

	if (Solicitacao.Contato === '') {
		Toast(
			'Informe o nome do contato para acompanhar a entrega da máquina',
			'warn'
		);
		setDesativar(false);
		return false;
	}

	// if (Solicitacao.Email_Acompanhamento === "") {
	//   Toast("Preencha um email para receber atualizações sobre o pedido", 'warn');
	//   setDesativar(false);
	//   return;
	// }

	if (Solicitacao.Telefone_Contato === '') {
		Toast(
			'Informe o número de telefone do contato que acompanhará a entrega da máquina',
			'warn'
		);
		setDesativar(false);
		return;
	}

	let toastId = null;

	try {
		toastId = Toast('Aguarde...', 'wait');
		await api.post('/equip/requests', {
			Solicitacao,
		});

		Toast('Solicitação registrada com sucesso!', 'update', toastId, 'success');
		ResetarState();
		ResetarStep(0);
		setDesativar(false);
	} catch (err) {
		setDesativar(false);
	}
};

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Grow {...props} timeout={300} />;
});
