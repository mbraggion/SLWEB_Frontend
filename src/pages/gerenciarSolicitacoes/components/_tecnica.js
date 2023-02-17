import React, { useState } from 'react';
import { api } from '../../../services/api';

import { Button, TextField, Typography } from '@material-ui/core';
import { Check, Close } from '@material-ui/icons/';

import DatePicker from '../../../components/materialComponents/datePicker';
import { Toast } from '../../../components/toasty';
import { convertData } from '../../../misc/commom_functions';
import moment from 'moment/moment';

export const Tecnica = ({ Req, onClose, onRefresh, stage }) => {
	const [wait, setWait] = useState(false);
	const [prevDate, setPrev] = useState(null);
	const [rejectReason, setReject] = useState('');
	const [eqInfo, setEqInfo] = useState({
		SLRaspyNum: Req.InfoEq.SLRaspyNum,
		EquipCod: Req.InfoEq.EquipCod,
		NumPatrimonio: Req.InfoEq.EquipPatr,
		TelemetriaNum: Req.InfoEq.TelemetriaNum,
		OSCTecDtTermino:
			Req.InfoEq.OSCTecDtTermino ?? moment().subtract(3, 'hours').toDate(),
	});

	const handleManagement = async (action) => {
		if (action === 'reject' && rejectReason.trim() === '') {
			Toast('Informe o motivo da rejeição', 'warn');
			setReject('');
			return;
		}

		setWait(true);
		let toastId = null;
		toastId = Toast('Aguarde...', 'wait');

		try {
			await api.put('/equip/requests/validate', {
				OSID: Req.OSCId,
				action: action,
				reject: rejectReason,
				prev: prevDate,
			});

			Toast('Atualização gravada', 'update', toastId, 'success');
			onClose();
			onRefresh();
		} catch (err) {
			Toast('Falha ao atualizar', 'update', toastId, 'error');
			setWait(false);
		}
	};

	const updatePrevDate = (date) => {
		date instanceof Date && !isNaN(date) ? setPrev(date) : setPrev(null);
	};

	// const updateTermDate = (date) => {
	//   // date instanceof Date && !isNaN(date)
	//   //   ? setEqInfo(oldState => ({
	//   //     ...oldState,
	//   //     OSCTecDtTermino: date
	//   //   }))
	//   //   : setPrev(null);
	// };

	const handleSaveEqInfo = async () => {
		if (eqInfo.OSCTecDtTermino === null || eqInfo.EquipCod === null) {
			Toast('Código do equipamento ou data de término não preenchidos', 'warn');
			return;
		}

		setWait(true);
		let toastId = null;

		try {
			toastId = Toast('Aguarde...', 'wait');

			await api.put('/equip/requests/inform/tec', {
				OSID: Req.OSCId,
				EqCod: eqInfo.EquipCod,
				NumPatrimonio: eqInfo.NumPatrimonio,
				RaspyCod: eqInfo.SLRaspyNum,
				TelemetriaCod: eqInfo.TelemetriaNum,
				DtTerminal: eqInfo.OSCTecDtTermino,
			});

			Toast('Atualização gravada', 'update', toastId, 'success');
			onClose();
			onRefresh();
		} catch (err) {
			Toast('Falha ao atualizar', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return stage === 2 ? (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
				width: '100%',
			}}
		>
			<div
				className='YAlign'
				style={{
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					width: '100%',
				}}
			>
				<div
					className='XAlign'
					style={{
						justifyContent: 'space-between',
						alignItems: 'flex-end',
					}}
				>
					<DatePicker
						label='Data Estimada'
						onChange={(e) => updatePrevDate(e._d)}
					/>
					<Button
						style={{
							marginBottom: '8px',
							border:
								prevDate !== null && !wait
									? '1px solid #000'
									: '1px solid #CCC',
						}}
						disabled={prevDate !== null && !wait ? false : true}
						onClick={(e) => handleManagement('accept')}
					>
						<Check />
						Aceitar OS
					</Button>
				</div>

				<label style={{ all: 'unset' }}>
					Data esperada: {convertData(Req.Datas.OSCDtPretendida)}
				</label>
			</div>

			<div
				className='XAlign'
				style={{
					justifyContent: 'space-between',
					alignItems: 'flex-end',
				}}
			>
				<TextField
					id='standard-basic'
					label='Motivo'
					onChange={(e) => setReject(e.target.value)}
					style={{
						margin: '0px 8px 0px 0px',
						width: '170px',
						borderBottom: '1px solid #AAA',
					}}
				/>
				<Button
					style={{
						border:
							rejectReason !== '' && !wait
								? '1px solid #000'
								: '1px solid #CCC',
					}}
					disabled={rejectReason !== '' && !wait ? false : true}
					onClick={(e) => handleManagement('reject')}
				>
					<Close />
					Rejeitar OS
				</Button>
			</div>
		</div>
	) : stage >= 3 ? (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
				width: '100%',
			}}
		>
			<div
				className='YAlign'
				style={{
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					width: '100%',
				}}
			>
				<div
					className='XAlign'
					style={{
						justifyContent: 'space-between',
						alignItems: 'flex-end',
					}}
				>
					{/* <DatePicker
                label="Termino da Montagem"
                onChange={(e) => updateTermDate(e._d)}
                defaultValue={eqInfo.OSCTecDtTermino}
                disabled
              /> */}
					<TextField
						label='N.º de Ativo'
						value={eqInfo.EquipCod}
						onChange={(e) => {
							e.persist();
							setEqInfo((oldState) => {
								return {
									...oldState,
									EquipCod: e.target.value,
								};
							});
						}}
						style={{
							borderBottom: '1px solid #AAA',
						}}
					/>
					<TextField
						label='N.º de patrimônio'
						value={eqInfo.NumPatrimonio}
						onChange={(e) => {
							e.persist();
							setEqInfo((oldState) => {
								return {
									...oldState,
									NumPatrimonio: e.target.value,
								};
							});
						}}
						style={{
							borderBottom: '1px solid #AAA',
						}}
					/>
				</div>
			</div>

			<div
				className='XAlign'
				style={{
					justifyContent: 'space-between',
					alignItems: 'flex-end',
				}}
			>
				<TextField
					label='N.º SLRaspy'
					value={eqInfo.SLRaspyNum}
					onChange={(e) => {
						e.persist();
						setEqInfo((oldState) => {
							return {
								...oldState,
								SLRaspyNum: e.target.value,
							};
						});
					}}
					style={{
						borderBottom: '1px solid #AAA',
					}}
				/>
				<TextField
					label='N.º Telemetria'
					value={eqInfo.TelemetriaNum}
					onChange={(e) => {
						e.persist();
						setEqInfo((oldState) => {
							return {
								...oldState,
								TelemetriaNum: e.target.value,
							};
						});
					}}
					style={{
						borderBottom: '1px solid #AAA',
					}}
				/>
			</div>

			<Button
				variant='outlined'
				color='primary'
				style={{
					marginTop: '8px',
					width: '100%',
				}}
				onClick={handleSaveEqInfo}
			>
				<Check />
				Salvar
			</Button>
		</div>
	) : (
		<Typography>Você não pode gerenciar essa solicitação no momento</Typography>
	);
};
