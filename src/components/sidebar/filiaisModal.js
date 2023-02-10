import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Draggable from 'react-draggable';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	List,
	ListItem,
	Divider,
	ListItemText,
	TextField,
} from '@material-ui/core';
import { Toast } from '../toasty';
import { navigateTo } from '../../misc/commom_functions';

export const FilialSelectionModal = ({ open, onClose }) => {
	const [filiais, setFiliais] = useState([]);
	const [filterWord, setFilterWord] = useState('');

	useEffect(() => {
		if (open) {
			LoadData();
		}
	}, [open]);

	const LoadData = async () => {
		try {
			const response = await api.get('/any/filiais');

			setFiliais(response.data);
		} catch (err) {
			setFiliais([]);
		}
	};

	const handleSwitchFilial = async (filial) => {
		let toastId = null;
		toastId = Toast('Aguarde...', 'wait');

		try {
			const response = await api.post('/admAuth/full', {
				user_code: filial,
			});

			Toast('Conectado!', 'update', toastId, 'success');

			sessionStorage.setItem('token', response.data.token);
			sessionStorage.setItem('role', response.data.role);
			sessionStorage.setItem('filial_logada', response.data.nome !== '');
			sessionStorage.setItem('usuário', response.data.nome);
			sessionStorage.setItem('links', JSON.stringify(response.data.Links));

			navigateTo('reload');
		} catch (err) {
			Toast('Falha ao logar na filial', 'update', toastId, 'error');
		}
	};

	const handleLogoutFilial = async () => {
		let toastId = null;
		toastId = Toast('Aguarde...', 'wait');

		try {
			const response = await api.get('/admAuth/logout');

			Toast('Conectado!', 'update', toastId, 'success');

			sessionStorage.setItem('token', response.data.token);
			sessionStorage.setItem('role', response.data.role);
			sessionStorage.setItem('filial_logada', response.data.nome !== '');
			sessionStorage.setItem('usuário', response.data.nome);
			sessionStorage.setItem('links', JSON.stringify(response.data.Links));

			navigateTo('move', '/');
		} catch (err) {
			Toast('Falha ao logar na filial', 'update', toastId, 'error');
		}
	};

	const handleClose = () => {
		setFiliais([]);
		setFilterWord('');
		onClose();
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					Filiais
				</DialogTitle>

				<DialogContent>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<TextField
							onChange={(e) => setFilterWord(e.target.value)}
							type='text'
							label='Procurar'
							autoFocus
						/>
						<List
							style={{
								maxHeight: '300px',
								overflow: 'auto',
								marginTop: '8px',
								minWidth: '400px',
							}}
						>
							{returnFilteredFranquadosList(filiais, filterWord).length ===
							0 ? (
								<ListItem button onClick={() => {}}>
									<ListItemText primary='' />
									<ListItemText primary='Carregando Filiais...' />
								</ListItem>
							) : (
								returnFilteredFranquadosList(filiais, filterWord).map(
									(filial, index) => (
										<div key={filial.M0_CODFIL}>
											<ListItem
												button
												onClick={() => handleSwitchFilial(filial.M0_CODFIL)}
											>
												<ListItemText primary={filial.M0_CODFIL} />
												<ListItemText primary={filial.GrupoVenda} />
											</ListItem>
											<Divider />
										</div>
									)
								)
							)}
						</List>
					</div>
				</DialogContent>
				<DialogActions style={{ padding: '8px 24px' }}>
					<div className='XAlign' style={{ justifyContent: 'space-between' }}>
						{sessionStorage.getItem('filial_logada') === 'true' ? (
							<Button onClick={handleLogoutFilial} color='primary'>
								Logout Filial
							</Button>
						) : (
							<div />
						)}
						<Button onClick={handleClose} color='primary'>
							Fechar
						</Button>
					</div>
				</DialogActions>
			</Dialog>
		</div>
	);
};

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

const returnFilteredFranquadosList = (franqueados, filterString) => {
	var re = new RegExp(filterString.trim().toLowerCase());

	return franqueados.filter((franqueado) => {
		if (filterString.trim() === '') {
			return true;
		} else if (
			filterString.trim() !== '' &&
			(franqueado.GrupoVenda.trim().toLowerCase().match(re) ||
				franqueado.M0_CODFIL.trim().toLowerCase().match(re))
		) {
			return true;
		} else {
			return false;
		}
	});
};
