import moment from 'moment';
import React, { useState } from 'react';
import Draggable from 'react-draggable';

import ButtonPure from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import History from '@material-ui/icons/History';
import { Campo } from '../../../components/commom_in';

import Button from '../../../components/materialComponents/Button';
import { GREY_SECONDARY, RED_PRIMARY } from '../../../misc/colors';

function PaperComponent(props) {
	return (
		<Draggable
			{...props}
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}
function DraggableDialog({ Req }) {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const convertData = (data, tipo = 'LLL') => {
		if (data === 'NA' || data === null || typeof data == 'undefined') {
			return 'NA';
		}

		return moment(data).utc().format(tipo);
	};

	return (
		<div>
			<Button
				style={{
					color: '#FFFFFF',
					background: GREY_SECONDARY,
				}}
				color='primary'
				onClick={handleClickOpen}
			>
				<History />
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					Histórico da Solicitação
				</DialogTitle>
				<DialogContent>
					<>
						<Campo>
							<Typography variant='subtitle1' gutterBottom>
								<strong>{convertData(Req.Datas.OSCDtSolicita)}: </strong>
								Solicitação feita pelo franqueado
							</Typography>

							{Req.Assinaturas.OSCComDtValidação !== null ? (
								<>
									<Divider />
									<Typography variant='subtitle1' gutterBottom>
										<strong>
											{convertData(Req.Assinaturas.OSCComDtValidação)}:{' '}
										</strong>
										Validação pelo departamento comercial
									</Typography>
								</>
							) : null}

							{Req.Assinaturas.OSCComAceite === true ? (
								<Typography
									style={{ color: RED_PRIMARY }}
									variant='subtitle1'
									gutterBottom
								>
									<strong>Aprovado</strong>
								</Typography>
							) : null}

							{Req.Assinaturas.OSCComAceite === false ? (
								<Typography
									style={{ color: RED_PRIMARY }}
									variant='subtitle1'
									gutterBottom
								>
									<strong>Rejeitado</strong>
								</Typography>
							) : null}

							{Req.Assinaturas.OSCComMotivo !== null ? (
								<Typography variant='subtitle1' gutterBottom>
									<strong>Mensagem(Comercial): </strong>
									{Req.Assinaturas.OSCComMotivo}
								</Typography>
							) : null}

							{Req.Assinaturas.OSCTecDtValidação !== null ? (
								<>
									<Divider />
									<Typography variant='subtitle1' gutterBottom>
										<strong>
											{convertData(Req.Assinaturas.OSCTecDtValidação)}:{' '}
										</strong>
										Validação pela Técnica
									</Typography>
								</>
							) : null}

							{Req.Assinaturas.OSCTecAceite === true ? (
								<Typography
									style={{ color: RED_PRIMARY }}
									variant='subtitle1'
									gutterBottom
								>
									<strong>Aprovado</strong>
								</Typography>
							) : null}

							{Req.Assinaturas.OSCTecAceite === false ? (
								<Typography
									style={{ color: RED_PRIMARY }}
									variant='subtitle1'
									gutterBottom
								>
									<strong>Rejeitado</strong>
								</Typography>
							) : null}

							{Req.Assinaturas.OSCTecMotivo !== null ? (
								<Typography variant='subtitle1' gutterBottom>
									<strong>Mensagem(Técnica): </strong>
									{Req.OSCTecMotivo}
								</Typography>
							) : null}

							{Req.Assinaturas.OSCTecDtPrevisao !== null ? (
								<Typography variant='subtitle1' gutterBottom>
									<strong>Data estimada para finalizar montagem: </strong>
									{convertData(Req.Assinaturas.OSCTecDtPrevisao, 'LL')}
								</Typography>
							) : null}

							{Req.Assinaturas.OSCExpDtPrevisao !== null ? (
								<>
									<Divider />
									<Typography variant='subtitle1' gutterBottom>
										<strong>Data de entrega foi prevista para: </strong>
										{convertData(Req.Assinaturas.OSCExpDtPrevisao, 'LL')}
									</Typography>
								</>
							) : null}

							{Req.Datas.OSCDtFechamento !== null &&
							Req.OSCStatus === 'Concluido' ? (
								<>
									<Divider />
									<Typography variant='subtitle1' gutterBottom>
										<strong>{convertData(Req.Datas.OSCDtFechamento)}: </strong>
										Franqueado confirmou ter recebido a máquina
									</Typography>
								</>
							) : null}
							{Req.Datas.OSCDtFechamento !== null &&
							Req.OSCStatus === 'Cancelado' ? (
								<>
									<Divider />
									<Typography variant='subtitle1' gutterBottom>
										<strong>{convertData(Req.Datas.OSCDtFechamento)}: </strong>
										Solicitação cancelada
									</Typography>
								</>
							) : null}
						</Campo>
					</>
				</DialogContent>
				<DialogActions style={{ padding: '8px 24px' }}>
					<ButtonPure onClick={handleClose} color='primary'>
						Fechar
					</ButtonPure>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default DraggableDialog;
