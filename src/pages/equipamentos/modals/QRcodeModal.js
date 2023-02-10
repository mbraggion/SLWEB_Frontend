import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { api } from '../../../services/api';

import { makeStyles } from '@material-ui/styles';
import {
	Button,
	IconButton,
	FormControlLabel,
	Tooltip,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Typography,
} from '@material-ui/core';
import { Toast } from '../../../components/toasty';
import {
	Link as LinkIcon,
	Refresh as RefreshIcon,
	Delete as DeleteIcon,
} from '@material-ui/icons';

function ModalPersonalizado({ open, onClose, title, ativo }) {
	const [loadingAudit, setLoadingAudit] = useState(true);
	const [loadingAtiv, setLoadingAtiv] = useState(true);
	const [qrMaquina, setQrMaquina] = useState(null);
	const [qrAuditoria, setQrAuditoria] = useState(null);
	const [linkAudit, setLinkAudit] = useState({
		id: null,
		link: null,
		status: null,
	});

	const classes = useStyles();

	useEffect(() => {
		if (open === true) {
			loadQrAtivo();
			loadQrAuditoria();
		} else {
			setQrMaquina(null);
			setQrAuditoria(null);
			setLinkAudit({
				id: null,
				link: null,
				status: null,
			});
			setLoadingAudit(true);
			setLoadingAtiv(true);
		}
		// eslint-disable-next-line
	}, [open]);

	const loadQrAtivo = async () => {
		try {
			const response = await api.get(`/ativo/qrcode/${ativo}`);

			setQrMaquina(response.data.b64QR);
			setLoadingAtiv(false);
		} catch (err) {}
	};

	const loadQrAuditoria = async () => {
		try {
			const response = await api.get(`/audit/check/${ativo}`);

			setQrAuditoria(response.data.QRCodeB64);
			setLinkAudit({
				id: response.data.id,
				link: response.data.link,
				status: response.data.status,
			});
			setLoadingAudit(false);
		} catch (err) {}
	};

	const handleCreateAuditLink = async () => {
		setLoadingAudit(true);

		let toastId = null;
		toastId = Toast('Criando link...', 'wait');

		try {
			const response = await api.post(`/audit/`, {
				eqcod: ativo,
			});

			Toast('Link criado com sucesso!', 'update', toastId, 'success');
			setQrAuditoria(response.data.QRCodeB64);
			setLinkAudit({
				id: response.data.id,
				link: response.data.link,
				status: response.data.status,
			});
			setLoadingAudit(false);
		} catch (err) {
			Toast('Falha ao criar link', 'update', toastId, 'error');
			setLoadingAudit(false);
		}
	};

	const handleUpdateLink = async (id, update, status = null) => {
		// update = link | compartilhamento
		setLoadingAudit(true);

		let toastId = null;
		toastId = Toast('Atualizando link...', 'wait');

		try {
			const response = await api.put(`/audit/update/${id}`, {
				type: update,
				status: status,
			});

			Toast('Link atualizado com sucesso!', 'update', toastId, 'success');
			setQrAuditoria(response.data.QRCodeB64);
			setLinkAudit({
				id: response.data.id,
				link: response.data.link,
				status: response.data.status,
			});
			setLoadingAudit(false);
		} catch (err) {
			Toast('Falha ao atualizar link', 'update', toastId, 'error');
			setLoadingAudit(false);
		}
	};

	const handleDeleteLink = async (id) => {
		setLoadingAudit(true);

		let toastId = null;
		toastId = Toast('Desativando link...', 'wait');

		try {
			await api.delete(`/audit/delete/${id}`);

			Toast('Link desativado com sucesso!', 'update', toastId, 'success');
			setLoadingAudit(false);
			setQrAuditoria(null);
			setLinkAudit({
				id: null,
				link: null,
				status: null,
			});
		} catch (err) {
			Toast('Falha ao desativar link', 'update', toastId, 'error');
			setLoadingAudit(false);
		}
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={onClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					{title}
				</DialogTitle>

				<DialogContent>
					<div className={classes.outerContainer}>
						<div className={classes.container}>
							<Typography gutterBottom variant='button'>
								Matrícula da máquina
							</Typography>
							{loadingAtiv ? (
								<>
									<Typography align='center'>Aguarde...</Typography>
									<div />
								</>
							) : (
								<>
									<img alt='QR CODE' className={classes.img} src={qrMaquina} />
									<Typography variant='caption'>
										<strong>{ativo}</strong>
									</Typography>
								</>
							)}
						</div>
						<div className={classes.container} style={{ height: '330px' }}>
							<Typography gutterBottom variant='button'>
								Link para auditoria
							</Typography>
							{loadingAudit ? (
								<>
									<Typography align='center'>Aguarde...</Typography>
									<div />
								</>
							) : linkAudit.id !== null ? (
								<>
									<img
										alt='QR CODE'
										className={classes.img}
										src={qrAuditoria}
									/>
									<Typography
										variant='caption'
										component='a'
										href={linkAudit.link}
										target='_blank'
										className={classes.linkText}
									>
										<strong>{linkAudit.link}</strong>
									</Typography>
									<div style={{ display: 'flex', flexDirection: 'column' }}>
										<FormControlLabel
											value='end'
											control={
												<Checkbox
													color='primary'
													checked={linkAudit.status}
													onChange={() =>
														handleUpdateLink(
															linkAudit.id,
															'compartilhamento',
															linkAudit.status
														)
													}
													className={classes.checkbox}
												/>
											}
											label='Compartilhar leituras'
											labelPlacement='end'
										/>

										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-evenly',
											}}
										>
											<Tooltip
												title={
													<div
														style={{
															fontSize: '14px',
															color: '#FFF',
															lineHeight: '20px',
														}}
													>
														<Typography color='inherit'>
															Gerar novo link
														</Typography>{' '}
													</div>
												}
												placement='top'
												arrow={true}
											>
												<IconButton
													aria-label='refresh'
													color='primary'
													onClick={() => handleUpdateLink(linkAudit.id, 'link')}
												>
													<RefreshIcon />
												</IconButton>
											</Tooltip>
											<Tooltip
												title={
													<div
														style={{
															fontSize: '14px',
															color: '#FFF',
															lineHeight: '20px',
														}}
													>
														<Typography color='inherit'>
															Desativar link
														</Typography>{' '}
													</div>
												}
												placement='top'
												arrow={true}
											>
												<IconButton
													aria-label='delete'
													color='secondary'
													onClick={() => handleDeleteLink(linkAudit.id)}
												>
													<DeleteIcon />
												</IconButton>
											</Tooltip>
										</div>
									</div>
								</>
							) : (
								<>
									<Button
										startIcon={<LinkIcon />}
										onClick={handleCreateAuditLink}
										variant='outlined'
										color='primary'
										className={classes.button}
									>
										Criar link para auditoria
									</Button>
									<Typography variant='caption'>
										<strong>Link ainda não criado!</strong>
									</Typography>
								</>
							)}
						</div>
					</div>
				</DialogContent>

				<DialogActions style={{ padding: '8px 24px' }}>
					<Button onClick={onClose} color='primary'>
						Fechar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ModalPersonalizado;

function PaperComponent(props) {
	return (
		<Draggable
			{...props}
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} style={{ maxHeight: '600px' }} />
		</Draggable>
	);
}

const useStyles = makeStyles(() => ({
	outerContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		height: '300px',
		maxWidth: '250px',
		margin: '16px',
		overflow: 'hidden',
	},
	img: {
		width: '200px',
		height: '200px',
		border: '1px solid #CCC',
		borderRadius: '4px',
	},
	linkText: {
		width: '100%',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	},
	checkbox: {
		transform: 'scale(0.3)',
	},
	button: {
		margin: '10% 0px 20% 0px',
	},
}));
