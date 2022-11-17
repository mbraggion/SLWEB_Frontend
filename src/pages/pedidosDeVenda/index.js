import React, { useEffect, useState } from "react";
import { api } from '../../services/api';

import Loading from "../../components/loading_screen";

import { Panel } from "../../components/commom_in";
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
      const response = await api.get("/pedidos/venda/");

      setLoaded(true);
      setPedidos(response.data.Pedidos)
    } catch (err) {
      console.log(err)
    }
  }

  const handleForceCarga = async () => {}

  return !loaded
    ? (
      <Loading />
    ) : (
      <Panel>
        <PedidosListOptions
          onChangeFiltro={setFiltro}
          onRequestIntegration={handleForceCarga}
        />
        <PedidosDeVendaList pedidos={returnPedidosFiltrados(pedidos, filtro)}/>
      </Panel>
    );
}

export default PedidosDeVenda;

const returnPedidosFiltrados = (pedidos, filterString) => {
  return pedidos
  // var re = new RegExp(filterString.trim().toLowerCase())

  // return pedidos.filter(ped => {
  //   if (shouldShowBilled) {
  //     return true
  //   } else if (!shouldShowBilled && ped.Status === 'Aguardando') {
  //     return true
  //   } else {
  //     return false
  //   }
  // }).filter(ped => {
  //   if (filterString.trim() === '') {
  //     return true
  //   } else if (filterString.trim() !== '' && (
  //     String(ped.PedidoID).trim().toLowerCase().match(re) || String(ped.CodigoCliente).trim().toLowerCase().match(re)
  //   )) {
  //     return true
  //   } else {
  //     return false
  //   }
  // })
}