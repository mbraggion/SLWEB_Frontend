import React, { useState } from 'react';
import { api } from '../../../services/api';

import { Button } from '@material-ui/core';

import { GREY_SECONDARY } from '../../../misc/colors';
import { Toast } from '../../../components/toasty';

export const Sistema = ({ Req, onClose, onRefresh }) => {
	const [wait, setWait] = useState(false);

	const SUDO = async (action) => {
		setWait(true);
		let toastId = null;

		try {
			toastId = Toast('Aguarde...', 'wait');
			await api.put('/equip/requests/admin', {
				OSID: Req.OSCId,
				action,
			});

			Toast('Atualização gravada com sucesso!', 'update', toastId, 'success');
			onClose();
			onRefresh();
		} catch (err) {
			setWait(false);
			Toast('Falha ao gravar atualização', 'update', toastId, 'error');
		}
	};

	return (
		<div
			className='XAlign'
			style={{
				justifyContent: 'space-between',
				width: '100%',
				flexWrap: 'wrap',
			}}
		>
			<div className='YAlign' style={{ width: '100%', marginRight: '8px' }}>
				<Button
					disabled={wait}
					style={{
						backgroundColor: wait ? '#CCC' : GREY_SECONDARY,
						color: '#FFFFFF',
						borderBottom: '8px',
						width: '100%',
						marginBottom: '8px',
						whiteSpace: 'nowrap',
					}}
					onClick={() => SUDO('RC')}
				>
					Remover Comercial
				</Button>
				<Button
					disabled={wait}
					style={{
						backgroundColor: wait ? '#CCC' : GREY_SECONDARY,
						color: '#FFFFFF',
						borderBottom: '8px',
						width: '100%',
						marginBottom: '8px',
						whiteSpace: 'nowrap',
					}}
					onClick={() => SUDO('RT')}
				>
					Remover Técnica
				</Button>
				<Button
					disabled={wait}
					style={{
						backgroundColor: wait ? '#CCC' : GREY_SECONDARY,
						color: '#FFFFFF',
						borderBottom: '8px',
						width: '100%',
						marginBottom: '8px',
						whiteSpace: 'nowrap',
					}}
					onClick={() => SUDO('RE')}
				>
					Remover Expedição
				</Button>
			</div>
			<div className='YAlign' style={{ width: '100%' }}>
				<Button
					disabled={wait}
					style={{
						backgroundColor: wait ? '#CCC' : GREY_SECONDARY,
						color: '#FFFFFF',
						borderBottom: '8px',
						width: '100%',
						marginBottom: '8px',
						whiteSpace: 'nowrap',
					}}
					onClick={() => SUDO('Cancelar')}
				>
					Cancelar OS
				</Button>
				<Button
					disabled={wait}
					style={{
						backgroundColor: wait ? '#CCC' : GREY_SECONDARY,
						color: '#FFFFFF',
						borderBottom: '8px',
						width: '100%',
						marginBottom: '8px',
						whiteSpace: 'nowrap',
					}}
					onClick={() => SUDO('Concluir')}
				>
					Concluir OS
				</Button>
				<Button
					disabled={wait}
					style={{
						backgroundColor: wait ? '#CCC' : GREY_SECONDARY,
						color: '#FFFFFF',
						borderBottom: '8px',
						width: '100%',
						marginBottom: '8px',
						whiteSpace: 'nowrap',
					}}
					onClick={() => SUDO('Ativar')}
				>
					Ativar OS
				</Button>
			</div>
		</div>
	);
};
