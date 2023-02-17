import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Draggable from 'react-draggable';
import { api } from '../../../services/api';

import { Close, Add } from '@material-ui/icons';
import {
	makeStyles,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	MenuItem,
	Typography,
	Tooltip,
} from '@material-ui/core';

import Select from '../../../components/materialComponents/Select';
import InputMultline from '../../../components/materialComponents/InputMultline';
import { RED_SECONDARY, GREY_SECONDARY } from '../../../misc/colors';
import { Toast } from '../../../components/toasty';

function ModalPersonalizado(props) {
	const [ativo, setAtivo] = useState('');
	const [obs, setObs] = useState('');
	const [ocorrencia, setOcorrencia] = useState('');
	const [reports, setReports] = useState([]);

	const classes = useStyles();

	useEffect(() => {
		async function LoadData() {
			try {
				const response = await api.get('/equip/reports');
				setReports(response.data.Reports);
			} catch (error) {}
		}
		LoadData();
	}, []);

	const handleSubmit = async () => {
		let toastId = null;
		let modelo = props.Ativos.filter(
			(element) => String(element.EquiCod) === String(ativo)
		);

		if (ocorrencia === '') {
			Toast('Declare um problema', 'warn');
			return;
		}

		if (ativo === '' && ocorrencia !== 'Não consta no meu cadastro') {
			Toast('Informe a qual ativo se refere o problema', 'warn');
			return;
		}

		const Report = {
			ativo,
			obs,
			ocorrencia,
			modelo: modelo.length > 0 ? modelo[0].EquiDesc : '',
			createdAt: new Date(),
		};

		try {
			toastId = Toast('Aguarde...', 'wait');
			await api.post('/equip/reports', {
				Report,
			});

			Toast('Problema reportado!', 'update', toastId, 'success');

			setReports((oldState) => {
				let aux = [...oldState];

				aux.unshift({
					EquiCod: Report.ativo,
					EqKODesc: Report.obs,
					EqKoTipo: Report.ocorrencia,
					EqKoDtAbertura: Report.createdAt,
					EquiDesc: Report.modelo,
					EqKoDtFechamento: null,
				});

				return aux;
			});
			setObs('');
			setAtivo('');
			setOcorrencia('');
		} catch (err) {
			Toast('Falha ao reportar problema', 'update', toastId, 'error');
		}
	};

	const handleCloseReport = async (report) => {
		let toastId = null;

		try {
			toastId = Toast('Aguarde...', 'wait');
			await api.put('/equip/reports', {
				Report: report,
			});

			Toast('Ocorrencia fechada', 'update', toastId, 'success');

			setReports((oldState) => {
				let aux = [...oldState];

				for (let i = 0; i < aux.length; i++) {
					if (
						aux[i].EquiCod === report.EquiCod &&
						aux[i].EqKoDtAbertura === report.EqKoDtAbertura
					) {
						aux[i].EqKoDtFechamento = new Date();
						break;
					}
				}

				return aux;
			});
		} catch (err) {
			Toast('Falha ao reportar problema', 'update', toastId, 'error');
		}
	};

	const SwitchOcorrencia = (ocorrencia) => {
		switch (ocorrencia) {
			case 'Modelo errado':
				setOcorrencia(ocorrencia);
				setObs('O modelo correto é MODELO');
				break;
			case 'Não consta no meu cadastro':
				setOcorrencia(ocorrencia);
				setObs('Favor adicionar a minha filial o ativo MATRÍCULA');
				setAtivo('');
				break;
			case 'Não está comigo':
				setOcorrencia(ocorrencia);
				setObs(`Favor desvincular da minha filial este ativo`);
				break;
			default:
				setOcorrencia('');
				setObs('');
				break;
		}
	};

	const handleOnClose = () => {
		props.onClose();
		setObs('');
		setAtivo('');
		setOcorrencia('');
	};

	return (
		<div>
			<Dialog
				open={props.open}
				onClose={handleOnClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					{props.title}
				</DialogTitle>

				<DialogContent>
					<div
						className='YAlign'
						style={{ width: '100%', justifyContent: 'flex-start' }}
					>
						<div
							className={classes.root}
							style={{
								marginBottom: '40px',
								paddingBottom: '8px',
								borderBottom: `1px dashed ${RED_SECONDARY}`,
							}}
						>
							<div
								className='XAlign'
								style={{
									flexWrap: 'wrap',
									justifyContent: 'flex-start',
									alignItems: 'center',
								}}
							>
								<Select
									width='250px'
									MBottom='8px'
									MLeft='8px'
									label='Problema'
									value={ocorrencia}
									onChange={(e) => SwitchOcorrencia(e.target.value)}
								>
									{problemas.map((problema) => (
										<MenuItem key={problema} value={problema}>
											{problema}
										</MenuItem>
									))}
								</Select>
								<Select
									width='120px'
									MBottom='8px'
									MLeft='8px'
									label='Ativo'
									disabled={ocorrencia === 'Não consta no meu cadastro'}
									value={ativo}
									onChange={(e) => setAtivo(e.target.value)}
								>
									{props.Ativos.map((ativo) => (
										<MenuItem key={ativo.EquiCod} value={ativo.EquiCod}>
											{ativo.EquiCod}
										</MenuItem>
									))}
								</Select>
								<InputMultline
									style={{ margin: '0px 8px 8px 8px', height: '100%' }}
									value={String(obs)}
									id='outlined-basic'
									label='Observações'
									variant='outlined'
									onChange={(e) => setObs(e.target.value)}
								/>
								<Button
									style={{ margin: '0px 0px 8px 8px', height: '100%' }}
									onClick={handleSubmit}
									color='primary'
									variant='contained'
								>
									<Add />
								</Button>
							</div>
						</div>

						<div style={{ height: '100%' }}>
							{reports.map((report, index) => (
								<div
									key={index}
									className={classes.root}
									style={{ height: '100%' }}
								>
									<div
										className='XAlign'
										style={{
											flexWrap: 'wrap',
											justifyContent: 'flex-start',
											alignItems: 'center',
										}}
									>
										<Select
											width='250px'
											MLeft='8px'
											MBottom='8px'
											label='Problema'
											value={report.EqKoTipo}
											disabled
										>
											{problemas.map((problema) => (
												<MenuItem key={problema} value={problema}>
													{problema}
												</MenuItem>
											))}
										</Select>
										<Select
											width='120px'
											label='Ativo'
											MLeft='8px'
											MBottom='8px'
											value={report.EquiCod}
											disabled
										>
											<MenuItem value={report.EquiCod}>
												{report.EquiCod}
											</MenuItem>
										</Select>
										<InputMultline
											style={{ margin: '0px 8px 8px 8px', height: '100%' }}
											value={
												report.EqKODesc !== null
													? String(report.EqKODesc).trim()
													: ''
											}
											id='outlined-basic'
											label='Observações'
											variant='outlined'
											disabled
										/>
										<Tooltip
											title={
												<label
													style={{
														fontSize: '14px',
														color: '#FFF',
														lineHeight: '20px',
													}}
												>
													Fechar ocorrencia
												</label>
											}
											placement='top'
											arrow
										>
											<Button
												onClick={() => handleCloseReport(report)}
												style={{ margin: '0px 0px 8px 8px', height: '100%' }}
												color='primary'
												variant='outlined'
												disabled={report.EqKoDtFechamento}
											>
												<Close />
											</Button>
										</Tooltip>
									</div>
									<div
										className='XAlign'
										style={{ justifyContent: 'flex-start', paddingLeft: '8px' }}
									>
										<div
											style={{
												borderRadius: '5px',
												border: `1px solid ${RED_SECONDARY}`,
												padding: '0px 8px',
												margin: '8px 0px 0px 0px',
											}}
										>
											<Typography style={{ color: RED_SECONDARY }}>
												Registrado:{' '}
												{moment(report.EqKoDtAbertura).utc().format('l')}
											</Typography>
										</div>
										{report.EqKoDtFechamento ? (
											<>
												<Typography style={{ margin: '8px 16px 0px 16px' }}>
													|
												</Typography>
												<div
													style={{
														borderRadius: '5px',
														background: GREY_SECONDARY,
														padding: '0px 8px',
														margin: '8px 0px 0px 0px',
													}}
												>
													<Typography style={{ color: '#FFF' }}>
														Fechado:{' '}
														{moment(report.EqKoDtFechamento).utc().format('l')}
													</Typography>
												</div>
											</>
										) : (
											<>
												<Typography style={{ margin: '8px 16px 0px 16px' }}>
													|
												</Typography>
												<div
													style={{
														background: RED_SECONDARY,
														borderRadius: '5px',
														padding: '0px 8px',
														margin: '8px 0px 0px 0px',
													}}
												>
													<Typography style={{ color: '#FFF' }}>
														<strong>Aberto</strong>
													</Typography>
												</div>
											</>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</DialogContent>
				<DialogActions style={{ padding: '8px 24px' }}>
					{props.action}
					<Button onClick={handleOnClose} color='primary'>
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
			<Paper
				{...props}
				style={{ maxHeight: '600px', width: '100%', maxWidth: '730px' }}
			/>
		</Draggable>
	);
}

const problemas = [
	'Modelo errado',
	'Não consta no meu cadastro',
	'Não está comigo',
];

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		paddingBottom: '8px',
		marginBottom: '16px',
		borderBottom: '1px solid #ccc',

		'&:last-child': {
			borderBottom: 'none',
			marginBottom: '0px',
			paddingBottom: '0px',
		},
	},
}));
