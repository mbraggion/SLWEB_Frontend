import React, { useState } from 'react';
import moment from 'moment';
import { api } from '../../../services/api';

import { Button, TextField, Typography } from '@material-ui/core';
import { Check, Close } from '@material-ui/icons/';

import DatePicker from '../../../components/materialComponents/datePicker';
import { Toast } from '../../../components/toasty';

export const Comercial = ({ Req, onClose, onRefresh, stage }) => {
	const [wait, setWait] = useState(false);
	const [rejectReason, setReject] = useState('');
	const [prevDate, setPrev] = useState(Req.Assinaturas.OSCExpDtPrevisao);
	const [numNFe, setNumNFe] = useState(Req.Entrega.NF);

	const handleManagement = async (action) => {
		setWait(true);
		let toastId = null;

		try {
			toastId = Toast('Aguarde...', 'wait');
			await api.put('/equip/requests/validate', {
				OSID: Req.OSCId,
				action: action,
				reject: rejectReason,
				prev: null,
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

	const handleSaveExpInfo = async () => {
		if (prevDate === null || numNFe === null || String(numNFe).trim() === '') {
			Toast('Data de previsão ou número da nota não informados', 'warn');
			return;
		}

		setWait(true);
		let toastId = null;

		try {
			toastId = Toast('Aguarde...', 'wait');

			await api.put('/equip/requests/inform/exp', {
				OSID: Req.OSCId,
				Previsao: prevDate,
				NumNF: numNFe,
			});

			Toast('Atualização gravada', 'update', toastId, 'success');
			onClose();
			onRefresh();
		} catch (err) {
			Toast('Falha ao atualizar', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return stage === 1 ? (
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
				<Button
					disabled={wait}
					style={{
						margin: '0px 0px 8px 0px',
						border: !wait ? '1px solid #000' : '1px solid #CCC',
					}}
					onClick={(e) => handleManagement('accept')}
				>
					<Check />
					Aceitar OS
				</Button>
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
	) : stage >= 4 ? (
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
				className='XAlign'
				style={{
					justifyContent: 'space-between',
					alignItems: 'baseline',
				}}
			>
				<DatePicker
					label='Previsão entrega'
					min={moment().toDate()}
					onChange={(e) => updatePrevDate(e._d)}
					defaultValue={prevDate}
					focus={false}
				/>
				<TextField
					label='Número da nota'
					value={numNFe}
					type='number'
					onChange={(e) => {
						e.persist();
						setNumNFe(e.target.value);
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
				onClick={handleSaveExpInfo}
			>
				<Check />
				Salvar
			</Button>
		</div>
	) : (
		<Typography>Você não pode gerenciar essa solicitação no momento</Typography>
	);
};
