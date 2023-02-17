import React, { useState } from 'react';
import moment from 'moment';
import { api } from '../../../services/api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Typography,
	Divider,
	Button,
	ButtonGroup,
} from '@material-ui/core/';
import { useTheme, withStyles } from '@material-ui/core/styles';
import {
	Close as CloseIcon,
	BusinessCenter as BusinessCenterIcon,
	ThumbDown as ThumbDownIcon,
	Announcement as AnnouncementIcon,
} from '@material-ui/icons';
import Input from '../../../components/materialComponents/InputMultline';
import { Toast } from '../../../components/toasty';
import {
	AddLimite,
	MoveLinha,
	UpdateLinha,
} from '../../../global/actions/LeadAction';

const LeadModal = ({
	open,
	onClose,
	Lead,
	History,
	MotivoDaDesistencia,
	onChangeMotivoDaDesistencia,
	...props
}) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [wait, setWait] = useState(false);
	const { AddLimite, MoveLinha, UpdateLinha } = props;

	const handleClose = () => {
		onClose();
	};

	const handleManageLead = async (id, type) => {
		if (type === 'release' && MotivoDaDesistencia.trim() === '') {
			Toast('Informe o motivo da desistência', 'warn');
			return;
		}

		let toastId = null;
		toastId = Toast('Aguarde...', 'wait');

		try {
			setWait(true);
			const response = await api.put('/leads', {
				ID: id,
				type: type,
				motivo: MotivoDaDesistencia,
			});

			let aux = Lead;

			if (type === 'release') {
				aux = { ...aux, status: 'Desistido' };

				UpdateLinha(aux);
				Toast(
					'Voce desistiu do Lead com sucesso!',
					'update',
					toastId,
					'success'
				);
			} else if (type === 'confirm') {
				aux = { ...aux, status: 'Negociando' };

				UpdateLinha(aux);
				Toast(
					'Voce confirmou que está negocindo com o Lead!',
					'update',
					toastId,
					'success'
				);
			} else {
				aux = { ...aux, ...response.data[0], status: 'Resgatado' };

				MoveLinha(aux);
				AddLimite();
				Toast(
					'Voce reinvidicou o Lead com sucesso!',
					'update',
					toastId,
					'success'
				);
			}

			setWait(false);
			handleClose();
		} catch (err) {
			Toast('Falha ao remanejar o Lead', 'update', toastId, 'error');
		}
	};

	return (
		<Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
			<DialogTitle onClose={handleClose}>Contato Lead</DialogTitle>

			<DialogContent dividers>
				{whichContentShow(
					Lead,
					History,
					MotivoDaDesistencia,
					onChangeMotivoDaDesistencia
				)}
			</DialogContent>

			<DialogActions>
				{whichButtonsShow(Lead, wait, handleManageLead)}
			</DialogActions>
		</Dialog>
	);
};

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			AddLimite,
			MoveLinha,
			UpdateLinha,
		},
		dispatch
	);

export default connect(null, mapDispatchToProps)(LeadModal);

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

const whichContentShow = (lead, history, motivo, updateMotivo) => {
	if (lead !== null && lead.status === 'Disponivel') {
		return (
			<>
				<Typography variant='body1' gutterBottom>
					Você ainda não tem acesso ao contato desse lead.
				</Typography>
				<div style={{ marginTop: '8px' }}>
					{lead.Mensagem !== null && String(lead.Mensagem).trim() !== '' ? (
						<Typography variant='subtitle1' gutterBottom>
							Mensagem do cliente: <strong>{lead.Mensagem}</strong>{' '}
						</Typography>
					) : null}
					{showHistory(history)}
				</div>
			</>
		);
	} else if (lead !== null && lead.status === 'Resgatado') {
		return (
			<>
				<Typography variant='subtitle1' gutterBottom>
					<strong>Nome Fantasia: </strong>
					{lead.Nome_Fantasia}
				</Typography>
				<Typography variant='subtitle1' gutterBottom>
					<strong>Razão Social: </strong>
					{lead.Razao_Social}
				</Typography>
				<Typography variant='subtitle1' gutterBottom>
					<strong>Contato: </strong>
					{lead.Contato}
				</Typography>
				<Typography variant='subtitle1' gutterBottom>
					<strong>
						{lead.Municipio} - {lead.Estado}
					</strong>
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Fone 1: </strong>
					{lead.Fone_1}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Fone 2: </strong>
					{lead.Fone_2}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Email: </strong>
					{lead.Email}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Atividade / Descrição: </strong>
					{lead.AtividadeDesc}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Mensagem do cliente: </strong>
					{lead.Mensagem}
				</Typography>

				<br />

				{/* <Typography variant="subtitle1" gutterBottom>
        Lead assumido{" "}
        <strong>
          {returnTime(lead, false, Limites[0].MaxHoras)}
        </strong>
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Você tem até{" "}
        <strong>{returnTime(lead, true, Limites[0].MaxHoras)}</strong>{" "}
        para fechar com o cliente ou desistir do Lead
      </Typography> */}

				{showHistory(history)}

				<Input
					style={{ width: '100%' }}
					label='Motivo da desistência'
					onChange={(e) => updateMotivo(e.target.value)}
					value={motivo}
				/>
			</>
		);
	} else if (lead !== null && lead.status === 'Desistido') {
		return (
			<Typography variant='body1' gutterBottom>
				Você desistiu desse Lead.
			</Typography>
		);
	} else if (lead !== null && lead.status === 'Negociando') {
		return (
			<>
				<Typography variant='subtitle1' gutterBottom>
					<strong>Nome Fantasia: </strong>
					{lead.Nome_Fantasia}
				</Typography>
				<Typography variant='subtitle1' gutterBottom>
					<strong>Razão Social: </strong>
					{lead.Razao_Social}
				</Typography>
				<Typography variant='subtitle1' gutterBottom>
					<strong>Contato: </strong>
					{lead.Contato}
				</Typography>
				<Typography variant='subtitle1' gutterBottom>
					<strong>
						{lead.Municipio} - {lead.Estado}
					</strong>
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Fone 1: </strong>
					{lead.Fone_1}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Fone 2: </strong>
					{lead.Fone_2}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Email: </strong>
					{lead.Email}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Atividade / Descrição: </strong>
					{lead.AtividadeDesc}
				</Typography>

				<Typography variant='subtitle1' gutterBottom>
					<strong>Mensagem do cliente: </strong>
					{lead.Mensagem}
				</Typography>

				<br />
				{showHistory(history)}
			</>
		);
	} else {
		return null;
	}
};

const whichButtonsShow = (lead, wait, onManageLead) => {
	if (lead !== null && lead.status === 'Disponivel') {
		return (
			<Button
				onClick={() => onManageLead(lead.Id, 'hold')}
				disabled={wait}
				color='primary'
				variant='contained'
				startIcon={<AnnouncementIcon />}
			>
				Solicitar
			</Button>
		);
	} else if (lead !== null && lead.status === 'Resgatado') {
		return (
			<ButtonGroup disableElevation variant='contained' color='primary'>
				<Button
					onClick={() => onManageLead(lead.Id, 'confirm')}
					disabled={wait}
					color='primary'
					variant='contained'
					startIcon={<BusinessCenterIcon />}
				>
					Negócio Fechado
				</Button>
				<Button
					onClick={(e) => onManageLead(lead.Id, 'release')}
					disabled={wait}
					color='secondary'
					variant='outlined'
					startIcon={<ThumbDownIcon />}
				>
					Desistir
				</Button>
			</ButtonGroup>
		);
	} else if (lead !== null && lead.status === 'Desistido') {
		return null;
	} else if (lead !== null && lead.status === 'Negociando') {
		return (
			<Typography variant='body1'>Fechando negócio com o Lead...</Typography>
		);
	} else {
		return null;
	}
};

const showHistory = (history) => {
	return history === null ? (
		<div style={{ marginTop: '8px' }}>
			<Typography variant='subtitle1'>
				Desistências: <strong>Buscando...</strong>
			</Typography>
		</div>
	) : (
		<div style={{ marginTop: '8px' }}>
			<Typography variant='subtitle1'>
				Desistências: <strong>{history.length}</strong>
			</Typography>
			<Divider />

			{history.map((item, i) => (
				<div
					className='YAlign'
					style={{
						marginBottom: '8px',
						borderBottom: '1px dashed #CCC',
					}}
				>
					<Typography variant='subtitle1'>
						<strong>{i + 1}ª desistência:</strong>
					</Typography>
					<Typography variant='subtitle1' style={{ paddingLeft: '16px' }}>
						<strong>Data:</strong> {moment(item.DataFechamento).format('LL')}
					</Typography>
					<Typography variant='subtitle1' style={{ paddingLeft: '16px' }}>
						<strong>Motivo:</strong> "{item.Motivo}"
					</Typography>
				</div>
			))}
		</div>
	);
};
