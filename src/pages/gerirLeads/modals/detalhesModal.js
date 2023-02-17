import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { api } from '../../../services/api';

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Divider,
	Typography,
	Button,
} from '@material-ui/core/';

import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';

import {
	Close as CloseIcon,
	Delete as DeleteIcon,
	TrendingUp as TrendingUpIcon,
} from '@material-ui/icons';

import { Toast } from '../../../components/toasty';

export const DetailsModal = ({ open, onClose, targetID }) => {
	const theme = useTheme();
	const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [wait, setWait] = useState(false);
	const [report, setReport] = useState(INITIAL_STATE);

	useEffect(() => {
		async function LoadData() {
			try {
				const response = await api.get(`/leads/adm/${targetID}`);

				setReport(response.data);
			} catch (err) {}
		}

		if (targetID !== null) {
			LoadData();
		}
	}, [targetID]);

	const handleClose = () => {
		if (wait) {
			return;
		} else {
			onClose();
			setWait(false);
			setReport(INITIAL_STATE);
		}
	};

	const handleUpdateStatus = async (id, status) => {
		let toastId = null;

		toastId = Toast('Aguarde...', 'wait');
		setWait(true);

		try {
			await api.put(`/leads/${id}/${status}`);

			Toast('Status do Lead atualizado!', 'update', toastId, 'success');
			setWait(false);
		} catch (err) {
			Toast('Falha ao atualizar status do Lead', 'update', toastId, 'error');
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
				Dados do Lead
			</DialogTitle>

			<DialogContent dividers>
				<>
					<Typography variant='subtitle1' gutterBottom>
						<strong>Nome Fantasia: </strong>
						{report.Info.Nome_Fantasia}
					</Typography>
					<Typography variant='subtitle1' gutterBottom>
						<strong>Razão Social: </strong>
						{report.Info.Razao_Social}
					</Typography>
					<Typography variant='subtitle1' gutterBottom>
						<strong>Contato: </strong>
						{report.Info.Contato}
					</Typography>
					<Typography variant='subtitle1' gutterBottom>
						<strong>
							{report.Info.Municipio} - {report.Info.Estado}
						</strong>
					</Typography>

					<Typography variant='subtitle1' gutterBottom>
						<strong>Fone 1: </strong>
						{report.Info.Fone_1}
					</Typography>

					<Typography variant='subtitle1' gutterBottom>
						<strong>Fone 2: </strong>
						{report.Info.Fone_2}
					</Typography>

					<Typography variant='subtitle1' gutterBottom>
						<strong>Email: </strong>
						{report.Info.Email}
					</Typography>

					<Typography variant='subtitle1' gutterBottom>
						<strong>Atividade / Descrição: </strong>
						{report.Info.AtividadeDesc}
					</Typography>

					<Typography variant='subtitle1' gutterBottom>
						<strong>Mensagem do cliente: </strong>
						{report.Info.Mensagem}
					</Typography>

					<Divider variant='inset' />
					<li
						style={{
							listStyleType: 'none',
						}}
					>
						<Typography
							className={classes.dividerInset}
							color='primary'
							display='block'
							variant='caption'
						>
							Histórico do Lead
						</Typography>
					</li>

					{report.Historico.length === 0 ? (
						<Typography variant='subtitle1' gutterBottom>
							Nenhuma movimentação com o Lead
						</Typography>
					) : (
						report.Historico.map((hist) => returnHistoryDesc(hist))
					)}
				</>
			</DialogContent>

			<DialogActions>
				<Button
					onClick={() =>
						handleUpdateStatus(
							report.Info.Id,
							report.Info.Disponivel === true ? 'I' : 'A'
						)
					}
					startIcon={
						report.Info.Disponivel === true ? (
							<DeleteIcon />
						) : (
							<TrendingUpIcon />
						)
					}
					variant={report.Info.Disponivel === true ? 'outlined' : 'contained'}
					color={report.Info.Disponivel === true ? 'secondary' : 'primary'}
					disabled={wait || typeof report.Info.Disponivel === 'undefined'}
				>
					{report.Info.Disponivel === true
						? 'Desabilitar Lead'
						: 'Habilitar Lead'}
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
	formControl: {
		minWidth: 120,
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

const INITIAL_STATE = {
	Info: {
		Nome_Fantasia: '',
		Razao_Social: '',
		Contato: '',
		Municipio: '',
		Estado: '',
		Fone_1: '',
		Fone_2: '',
		Email: '',
		AtividadeDesc: '',
		Mensagem: '',
	},
	Historico: [],
};

const returnHistoryDesc = (history) => {
	if (history.Ativo === true) {
		return (
			<>
				<div
					className='YAlign'
					style={{
						padding: '0px 16px',
					}}
				>
					<Typography variant='subtitle1' gutterBottom>
						Assumido por: <strong>{history.Filial}</strong>
					</Typography>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							Em{' '}
							<strong>{moment(history.DataHora).utc(false).format('L')}</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							Até <strong>o momento</strong>
						</Typography>
					</div>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							<strong>Ativo</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							{moment(
								moment(history.DataHora)
									.utc(false)
									.format('YYYY-MM-DD HH:mm:ss')
							).fromNow(true)}
						</Typography>
					</div>
				</div>
				<Divider />
			</>
		);
	} else if (history.Desistiu === true) {
		return (
			<>
				<div
					className='YAlign'
					style={{
						padding: '0px 16px',
					}}
				>
					<Typography variant='subtitle1' gutterBottom>
						Assumido por: <strong>{history.Filial}</strong>
					</Typography>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							Em{' '}
							<strong>{moment(history.DataHora).utc(false).format('L')}</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							Até{' '}
							<strong>
								{moment(history.DataFechamento).utc(false).format('L')}
							</strong>
						</Typography>
					</div>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							<strong>Desistência</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							{moment(history.DataFechamento)
								.utc(false)
								.from(moment(history.DataHora).utc(false), true)}
						</Typography>
					</div>
					<Typography variant='subtitle1' gutterBottom>
						Motivo: <strong>"{history.Motivo}"</strong>
					</Typography>
				</div>
				<Divider />
			</>
		);
	} else if (history.Expirou === true) {
		return (
			<>
				<div
					className='YAlign'
					style={{
						padding: '0px 16px',
					}}
				>
					<Typography variant='subtitle1' gutterBottom>
						Assumido por: <strong>{history.Filial}</strong>
					</Typography>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							Em{' '}
							<strong>{moment(history.DataHora).utc(false).format('L')}</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							Até{' '}
							<strong>
								{moment(history.DataFechamento).utc(false).format('L')}
							</strong>
						</Typography>
					</div>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							<strong>Expiração</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							{moment(history.DataFechamento)
								.utc(false)
								.from(moment(history.DataHora).utc(false), true)}
						</Typography>
					</div>
				</div>
				<Divider />
			</>
		);
	} else if (history.Negociacao === true) {
		return (
			<>
				<div
					className='YAlign'
					style={{
						padding: '0px 16px',
					}}
				>
					<Typography variant='subtitle1' gutterBottom>
						Assumido por: <strong>{history.Filial}</strong>
					</Typography>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							Em{' '}
							<strong>{moment(history.DataHora).utc(false).format('L')}</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							Até{' '}
							<strong>
								{moment(history.DataFechamento).utc(false).format('L')}
							</strong>
						</Typography>
					</div>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						<Typography variant='subtitle1' gutterBottom>
							<strong>Negociação</strong>
						</Typography>
						<Typography variant='subtitle1' gutterBottom>
							{moment(history.DataFechamento)
								.utc(false)
								.from(moment(history.DataHora).utc(false), true)}
						</Typography>
					</div>
				</div>
				<Divider />
			</>
		);
	} else {
		return null;
	}
};
