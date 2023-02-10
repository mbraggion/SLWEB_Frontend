import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { Panel } from '../../components/commom_in';
import Loading from '../../components/loading_screen';
import { Toast } from '../../components/toasty';

import { PedidosListOptions } from './options';
import { PedidoList } from './pedidoList';

const PedidosDeCompra = () => {
	const timeFilter = 'week';

	const [pedidos, setPedidos] = useState([]);
	const [transportadoras, setTrasportadoras] = useState([]);
	const [loaded, setLoaded] = useState(false);
	// const [timeFilter, setTimeFilter] = useState('week')
	const [filtro, setFiltro] = useState('');
	const [mostrarProcessados, setMostrarProcessados] = useState(false);

	async function LoadData() {
		try {
			const response = await api.get(`/pedidos/compra/${timeFilter}`);

			setTrasportadoras(response.data.Transportadoras);
			setPedidos(response.data.Pedidos);
			setLoaded(true);
		} catch (err) {}
	}

	useEffect(() => {
		LoadData();
	}, []);

	const handleIntegrarPedidos = async () => {
		// alert('Em breve 😊')

		try {
			await api.get('/pedidos/compra/integracao');

			Toast('Integração em andamento!', 'info');
		} catch (err) {
			Toast('Falha ao solicitar integração', 'error');
		}
	};

	return !loaded ? (
		<Loading />
	) : (
		<Panel>
			<PedidosListOptions
				onChangeFiltro={setFiltro}
				mostrarProcessados={mostrarProcessados}
				switchProcessados={setMostrarProcessados}
				onRequestIntegration={handleIntegrarPedidos}
			/>
			<PedidoList
				Pedidos={returnPedidosFiltrados(pedidos, mostrarProcessados, filtro)}
				Transportadoras={transportadoras}
				onUpdatePedido={setPedidos}
			/>
		</Panel>
	);
};

export default PedidosDeCompra;

const returnPedidosFiltrados = (pedidos, shouldShowBilled, filterString) => {
	var re = new RegExp(filterString.trim().toLowerCase());

	return pedidos
		.filter((ped) => {
			if (shouldShowBilled) {
				return true;
			} else if (!shouldShowBilled && ped.Status === 'Aguardando') {
				return true;
			} else {
				return false;
			}
		})
		.filter((ped) => {
			if (filterString.trim() === '') {
				return true;
			} else if (
				filterString.trim() !== '' &&
				(String(ped.PedidoID).trim().toLowerCase().match(re) ||
					String(ped.CodigoCliente).trim().toLowerCase().match(re))
			) {
				return true;
			} else {
				return false;
			}
		});
};
