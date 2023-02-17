import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import moment from 'moment';

import { Email } from '@material-ui/icons';
import { Button as MaterialButton } from '@material-ui/core';

import { Panel } from '../../components/commom_in';
import { TelemetriasList } from './TelemetriasList';
import { DetailsModal } from './modals/Detalhes';
import { AbrirChamadoModal } from './modals/AbrirChamado';
import { toValidString } from '../../misc/commom_functions';
import { Toast } from '../../components/toasty';
import Loading from '../../components/loading_screen';
import { TelemetriasListOptions } from './options';

export default function Dashboard() {
	const [loaded, setLoaded] = useState(false);
	const [telemetrias, setTelemetrias] = useState([]);
	const [target, setTarget] = useState({});
	const [filtro, setFiltro] = useState('');
	const [modalChamadoOpen, setModalChamadoOpen] = useState(false);
	const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
	const [editableDetails, setEditableDetails] = useState(
		editableDetailsEmptyExample
	);

	useEffect(() => {
		async function LoadData() {
			try {
				const response = await api.get('/monitor/telemetrias');

				setLoaded(true);
				setTelemetrias(response.data);
			} catch (err) {}
		}
		LoadData();
	}, []);

	const handleOpenChamadoModal = (TMT) => {
		if (String(TMT.LeitOk).trim() !== 'KO') {
			return;
		}

		setTarget(TMT);
		setModalChamadoOpen(true);
		setEditableDetails({
			Email: toValidString(TMT.Email),
			Telefone: '',
			Endereco: {
				Logradouro: toValidString(TMT.PdvLogradouroPV),
				Numero: toValidString(TMT.PdvNumeroPV),
				Bairro: toValidString(TMT.PdvBairroPV),
				Complemento: toValidString(TMT.PdvComplementoPV),
				Cidade: toValidString(TMT.PdvCidadePV),
				UF: toValidString(TMT.PdvUfPV),
				CEP: toValidString(TMT.PdvCEP),
			},
		});
	};

	const handleCloseChamadoModal = () => {
		setModalChamadoOpen(false);
		setTarget({});
		setEditableDetails(editableDetailsEmptyExample);
	};

	const handleOpenDetailsModal = (TMT) => {
		setTarget(TMT);
		setModalDetailsOpen(true);
	};

	const handleCloseDetailsModal = () => {
		setTarget({});
		setModalDetailsOpen(false);
	};

	const handleAbrirChamado = async (TMT) => {
		if (
			toValidString(editableDetails.Email) === '' ||
			toValidString(editableDetails.Telefone) === '' ||
			toValidString(editableDetails.Endereco.Logradouro) === '' ||
			toValidString(editableDetails.Endereco.Numero) === '' ||
			toValidString(editableDetails.Endereco.Cidade) === '' ||
			toValidString(editableDetails.Endereco.UF) === '' ||
			toValidString(editableDetails.Endereco.CEP) === ''
		) {
			Toast('Preencha todos os campos', 'warn');
			return;
		}

		const DTO = {
			Ativo: TMT.EquiCod,
			UltLeitura:
				TMT.MáxDeDataLeitura !== null
					? moment(TMT.MáxDeDataLeitura).utc().format('DD/MM/YYYY HH:mm:ss')
					: 'Desconhecido',
			Franqueado: TMT.GrupoVenda,
			Email: toValidString(editableDetails.Email),
			Contato: toValidString(editableDetails.Telefone),
			Cliente: TMT.AnxDesc,
			Modelo: TMT.EquiDesc,
			Endereco: {
				Logradouro: toValidString(editableDetails.Endereco.Logradouro),
				Numero: toValidString(editableDetails.Endereco.Numero),
				Bairro: toValidString(editableDetails.Endereco.Bairro),
				Complemento: toValidString(editableDetails.Endereco.Complemento),
				Cidade: toValidString(editableDetails.Endereco.Cidade),
				UF: toValidString(editableDetails.Endereco.UF),
				CEP: toValidString(editableDetails.Endereco.CEP),
			},
		};

		let toastId = null;

		try {
			toastId = Toast('Abrindo chamado...', 'wait');

			await api.post('/monitor/telemetrias/chamado', {
				DTO,
			});

			setModalChamadoOpen(false);
			Toast('Chamado aberto!', 'update', toastId, 'success');

			setTarget({
				...target,
				UltChamado: moment().subtract(3, 'hours').toDate(),
			});

			setTelemetrias((oldState) => {
				let aux = [...oldState];

				aux.forEach((tel) => {
					if (tel.EquiCod === target.EquiCod) {
						tel.UltChamado = moment().subtract(3, 'hours').toDate();
					}
				});

				return aux;
			});
		} catch (err) {
			Toast(
				'Falha ao abrir chamado, tente novamente',
				'update',
				toastId,
				'error'
			);
		}
	};

	return !loaded ? (
		<Loading />
	) : (
		<Panel>
			<DetailsModal
				open={modalDetailsOpen}
				onClose={handleCloseDetailsModal}
				title={`Ativo ${target.EquiCod ? target.EquiCod : ''}`}
				TMT={target}
			/>
			<AbrirChamadoModal
				open={modalChamadoOpen}
				onClose={handleCloseChamadoModal}
				title='Abrir chamado'
				onChangeDetails={setEditableDetails}
				Details={editableDetails}
				UltChamado={target.UltChamado}
				action={
					<MaterialButton
						color='primary'
						onClick={() => handleAbrirChamado(target)}
						variant='contained'
						startIcon={<Email />}
						disabled={target.UltChamado !== null}
					>
						Abrir chamado
					</MaterialButton>
				}
			/>
			<TelemetriasListOptions onChangeFiltro={setFiltro} />
			<TelemetriasList
				onUpdateTelemetrias={setTelemetrias}
				telemetrias={returnTelemetriasFilter(telemetrias, filtro)}
				onOpenChamadoModal={handleOpenChamadoModal}
				onOpenDetailsModal={handleOpenDetailsModal}
			/>
		</Panel>
	);
}
const editableDetailsEmptyExample = {
	Email: '',
	Telefone: '',
	Endereco: {
		Logradouro: '',
		Numero: '',
		Bairro: '',
		Complemento: '',
		Cidade: '',
		UF: '',
		CEP: '',
	},
};

const returnTelemetriasFilter = (telemetrias, filterString) => {
	var re = new RegExp(filterString.trim().toLowerCase());

	return telemetrias.filter((tel) => {
		if (filterString.trim() === '') {
			return true;
		} else if (
			filterString.trim() !== '' &&
			(String(tel.EquiCod).trim().toLowerCase().match(re) ||
				String(tel.AnxDesc).trim().toLowerCase().match(re))
		) {
			return true;
		} else {
			return false;
		}
	});
};
