import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';

import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import { Toast } from '../../../components/toasty';

export const Equipamento = ({ PdvId, AnxId, onClose, updatePDVsArray }) => {
	const classes = useStyles();

	const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [wait, setWait] = useState(false);

	async function LoadData() {
		const response = await api.get(
			`/pontosdevenda/info/${PdvId}/${AnxId}/equip`
		);

		setEquipamentosDisponiveis(response.data.Dados.EqsDisp);
		setLoaded(true);
	}

	useEffect(() => {
		LoadData();
		// eslint-disable-next-line
	}, []);

	const handleSwitchEqOnPdv = async (eqcod) => {
		if (wait) return;

		let toastId = null;

		toastId = Toast('Trocando equipamento no ponto de venda...', 'wait');
		setWait(true);

		try {
			//faz o put
			const response = await api.put(
				`/pontosdevenda/atualizar/${PdvId}/${AnxId}/equip`,
				{
					UpdatedData: {
						NewEquip: eqcod,
					},
				}
			);

			Toast(
				'Ponto de venda atualizado com sucesso',
				'update',
				toastId,
				'success'
			);
			setWait(false);
			updatePDVsArray((oldState) => {
				let aux = [...oldState];
				let hoje = new Date();
				let indiceDoPdv = null;

				let targetPdv = aux.filter((pdv, i) => {
					if (pdv.PdvId === PdvId && pdv.AnxId === AnxId) {
						indiceDoPdv = i;
						return true;
					} else {
						return false;
					}
				})[0];

				//Atualiza pdv antigo com status I
				targetPdv = {
					...targetPdv,
					PdvStatus: 'I',
				};

				//Copio o pdv antigo como novo atualizando o PdvId
				let newPdv = {
					...targetPdv,
					PdvId: response.data.payback,
					EquiCod: eqcod,
					PdvDataAtivacao: hoje,
					PdvStatus: 'A',
				};

				aux[indiceDoPdv] = targetPdv;
				aux.unshift(newPdv);

				return aux;
			});
			// Fecha o modal
			onClose();
		} catch (err) {
			Toast('Falha ao atualizar ponto de venda', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return !loaded ? (
		<Typography variant='subtitle1'>Carregando...</Typography>
	) : (
		<>
			{equipamentosDisponiveis.length > 0 ? (
				equipamentosDisponiveis.map((eqs) => (
					<Typography
						className={classes.line}
						onClick={() => handleSwitchEqOnPdv(eqs.EquiCod)}
					>
						{eqs.EquiDesc} (Ativo {eqs.EquiCod})
					</Typography>
				))
			) : (
				<Typography variant='subtitle2'>
					Todas suas máquinas já estão vinculadas a outros clientes ;)
				</Typography>
			)}
		</>
	);
};

const useStyles = makeStyles((theme) => ({
	line: {
		width: '100%',
		padding: '10px 0px',
		textAlign: 'center',
		transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		backgroundColor: 'unset',
		fontWeight: 'normal',
		borderRadius: '4px',

		'&:hover': {
			transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			backgroundColor: '#CCC',
			cursor: 'pointer',
			fontWeight: 'bold',
		},
	},
}));
