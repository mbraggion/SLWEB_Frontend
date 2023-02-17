import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import Loading from '../../components/loading_screen';

import { Panel } from '../../components/commom_in';
import { PedidosListOptions } from './options';
import { PedidosDeVendaList } from './pedidosDeVendaList';

function PedidosDeVenda() {
	const [loaded, setLoaded] = useState(false);
	const [pedidos, setPedidos] = useState([]);
	const [filtro, setFiltro] = useState('');

	useEffect(() => {
		LoadData();
	}, []);

	async function LoadData() {
		try {
			const response = await api.get('/pedidos/venda/');

			setLoaded(true);
			setPedidos(response.data.Pedidos);
		} catch (err) {}
	}

	const handleForceCarga = async () => {};

	return !loaded ? (
		<Loading />
	) : (
		<Panel>
			<PedidosListOptions
				onChangeFiltro={setFiltro}
				onRequestIntegration={handleForceCarga}
			/>
			<PedidosDeVendaList
				pedidos={returnPedidosFiltrados(pedidos, filtro)}
				refresh={LoadData}
			/>
		</Panel>
	);
}

export default PedidosDeVenda;

const returnPedidosFiltrados = (pedidos, filterString) => {
	var re = new RegExp(filterString.trim().toLowerCase());

	return pedidos.filter((ped) => {
		if (filterString.trim() === '') {
			return true;
		} else if (
			filterString.trim() !== '' &&
			(String(ped.PedidoID).trim().toLowerCase().match(re) ||
				String(ped.CNPJ).trim().toLowerCase().match(re) ||
				String(ped.CodigoCliente).trim().toLowerCase().match(re) ||
				String(ped.Filial).trim().toLowerCase().match(re))
		) {
			return true;
		} else {
			return false;
		}
	});
};
